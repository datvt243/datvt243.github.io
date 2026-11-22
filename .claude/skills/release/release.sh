#!/usr/bin/env bash
# Promote staging into main. Usage: release.sh [patch|minor|major]
# Gate commands come from release.env next to this script (generated from
# agent-hub/doctrine/MEMORY.md). Exit: 0 released/nothing to do, 1 failed,
# 2 bump type needed.
set -euo pipefail

die() { echo "release: $*" >&2; exit 1; }

RELEASE_GATE=("npm run build")
RELEASE_REPORT_ONLY=()
RELEASE_AUTO_BUMP=false     # true = infer patch/minor/major from Conventional Commits
RELEASE_DEPLOY_WORKFLOW=""  # e.g. deploy.yml = CI deploys on push to main, report its run
env_file="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/release.env"
# shellcheck source=/dev/null
[ -f "$env_file" ] && . "$env_file"

cd "$(git rev-parse --show-toplevel)"
[ -z "$(git status --porcelain)" ] || die "working tree not clean — commit or stash first"
for c in gh node npm; do command -v "$c" >/dev/null || die "$c not found"; done

back_to_staging() {
  git fetch -q origin staging && git checkout -q -B staging origin/staging \
    && echo "local branch: staging (= origin/staging)" \
    || echo "release: could not return to staging, check out manually" >&2
}

# 0. Pre-flight
git fetch -q origin --tags
commits=$(git log origin/main..origin/staging --oneline)
[ -n "$commits" ] || { echo "nothing to release (origin/main..origin/staging empty)"; exit 0; }
current=$(git show origin/main:package.json | node -p "JSON.parse(require('fs').readFileSync(0)).version")
first=false; [ -z "$(git tag -l)" ] && first=true
echo "commits to release:"; echo "$commits"

# 1. Version
bump=${1:-}
if [ -z "$bump" ] && [ "$RELEASE_AUTO_BUMP" = true ]; then
  log=$(git log --no-merges --format='%s%n%b' origin/main..origin/staging)
  if grep -qE '^[a-z]+(\([^)]*\))?!:|BREAKING CHANGE' <<<"$log"; then bump=major
  elif grep -qE '^feat(\([^)]*\))?:' <<<"$log"; then bump=minor
  else bump=patch; fi # non-conventional subjects count as patch
  echo "auto bump: $bump (from Conventional Commits)"
fi
if $first; then
  version=$current
  echo "first-ever release: v$version as-is (bump ignored)"
else
  if [[ ! $bump =~ ^(patch|minor|major)$ ]]; then
    [ -t 0 ] || { echo "release: bump type needed: patch|minor|major" >&2; exit 2; }
    read -rp "bump (patch/minor/major): " bump
    [[ $bump =~ ^(patch|minor|major)$ ]] || die "invalid bump: $bump"
  fi
  # shortcut: plain X.Y.Z only, prerelease/build suffixes are not handled; use npm's semver if one appears
  [[ $current =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]] || die "unsupported version on main: $current"
  ma=${BASH_REMATCH[1]} mi=${BASH_REMATCH[2]} pa=${BASH_REMATCH[3]}
  case $bump in
    major) version="$((ma + 1)).0.0" ;;
    minor) version="$ma.$((mi + 1)).0" ;;
    patch) version="$ma.$mi.$((pa + 1))" ;;
  esac
  echo "v$current → v$version ($bump)"
fi
tag="v$version"
git rev-parse -q --verify "refs/tags/$tag" >/dev/null && die "tag $tag already exists"
trap back_to_staging EXIT

# 2-3. Release branch + bump (skipped on first-ever release)
if $first; then
  head=staging
  git checkout -q --detach origin/staging
else
  head="release/$tag"
  git checkout -q -B "$head" origin/staging
  npm version "$version" --no-git-tag-version >/dev/null
  git commit -qam "chore: release $tag"
fi

# 4. Local gate — build/test fail stops; baseline rows only report
for cmd in "${RELEASE_GATE[@]}"; do
  echo "gate: $cmd"
  bash -c "$cmd" || die "gate failed: $cmd — nothing pushed, no PR, no tag"
done
for cmd in "${RELEASE_REPORT_ONLY[@]+"${RELEASE_REPORT_ONLY[@]}"}"; do
  echo "report-only: $cmd"
  rc=0; bash -c "$cmd" || rc=$?
  echo "report-only: $cmd → exit $rc (baseline debt, not blocking)"
done
$first || git push -q -u origin "$head"

# Waits for required checks; "no required checks" is not a failure.
wait_checks() {
  local pr=$1 out rc=0
  sleep 15 # let CI register its checks on the new PR
  gh pr checks "$pr" --watch --required --fail-fast --interval 30 >/dev/null 2>&1 || true
  out=$(gh pr checks "$pr" --required 2>&1) || rc=$?
  echo "$out"
  [ "$rc" -eq 0 ] || grep -q "no required checks" <<<"$out" \
    || die "required checks failed on PR #$pr — see: gh run view <run-id> --log-failed"
}

# Issues this release ships: open issues referenced as #n in the commits,
# plus closes/fixes/resolves #n in the body of every PR referenced there
# (staging merge commits only carry the PR number)
refs=()
for n in $(grep -oE '#[0-9]+' <<<"$commits" | tr -d '#' | sort -un); do
  is_pr=$(gh api "repos/{owner}/{repo}/issues/$n" --jq '.pull_request != null' 2>/dev/null) || continue
  if [ "$is_pr" = true ]; then
    refs+=($(gh pr view "$n" --json body --jq '.body // ""' \
      | grep -oiE '(^|[^[:alnum:]])(close[sd]?|fix(e[sd])?|resolve[sd]?)[[:space:]]+#[0-9]+' | grep -oE '[0-9]+$' || true))
  else
    refs+=("$n")
  fi
done
issues=()
for n in $(printf '%s\n' "${refs[@]+"${refs[@]}"}" | sort -un); do
  [ "$(gh issue view "$n" --json state --jq .state 2>/dev/null)" = OPEN ] && issues+=("$n")
done
body=$commits
for n in "${issues[@]+"${issues[@]}"}"; do body+=$'\n'"Closes #$n."; done

# 5-6. Release PR, wait CI, real merge commit
url=$(gh pr create --base main --head "$head" --title "Release $tag" --body "$body")
pr=${url##*/}
echo "release PR: $url"
wait_checks "$pr"
if $first; then gh pr merge "$pr" --merge; else gh pr merge "$pr" --merge --delete-branch; fi

# 7. Tag the main merge commit
git fetch -q origin main
git tag -a "$tag" origin/main -m "Release $tag"
git push -q origin "$tag"
sha=$(git rev-parse --short origin/main)
echo "tagged $tag at $sha"

# 8. Deploy — failure never undoes the release
deploy="not configured (set DEPLOY_HOOK_URL to enable)"
if [ -n "${DEPLOY_HOOK_URL:-}" ]; then
  if curl -fsS -X POST "$DEPLOY_HOOK_URL"; then deploy="triggered"
  else deploy="FAILED — release stands, retry the deploy hook separately"; fi
elif [ -n "$RELEASE_DEPLOY_WORKFLOW" ]; then
  sleep 10 # let the push to main start the workflow
  deploy=$(gh run list --branch main --workflow "$RELEASE_DEPLOY_WORKFLOW" --limit 1 --json url --jq '.[0].url // empty')
  deploy="${deploy:-no $RELEASE_DEPLOY_WORKFLOW run found yet} (CI deploys on push to main)"
fi
echo "deploy: $deploy"

# 9. Sync the bump back to staging
sync_url="skipped (first-ever release)"
if ! $first; then
  sync_url=$(gh pr create --base staging --head main --title "chore: sync $tag back into staging" --body "Version bump from $url")
  wait_checks "${sync_url##*/}"
  gh pr merge "${sync_url##*/}" --merge
fi

# 10. Close shipped issues (staging merges don't trigger Closes #n)
# Closes #n in the release PR auto-closes on merge to main; this catches the rest
closed=()
for n in "${issues[@]+"${issues[@]}"}"; do
  [ "$(gh issue view "$n" --json state --jq .state 2>/dev/null)" = OPEN ] || { closed+=("#$n (auto)"); continue; }
  gh issue close "$n" --comment "Released to main via $url, tagged $tag." && closed+=("#$n (manual)")
done

# 11. Report (12. back to staging runs via trap)
echo
echo "released $tag  main@$sha"
echo "release PR: $url"
echo "sync PR:    $sync_url"
echo "deploy:     $deploy"
echo "closed:     ${closed[*]:-none}"
