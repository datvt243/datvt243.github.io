---
description: Promote staging into main — merge, bump semver + tag vX.Y.Z, deploy if DEPLOY_HOOK_URL is configured, then sync the version bump back to staging. Invoking this command IS the operator's go-ahead — no separate confirmation prompt.
---

Release `staging` into `main`, in this order. `main` NEVER receives code
any other way (no direct push — it's GitHub-protected; no PR from a
`bug/*`/`feature/*` branch — those only ever target `staging`).

0. **Pre-flight.** `git fetch origin`. Compare `git log origin/main..origin/staging --oneline` — if empty, there's nothing to release: say so and stop. Read `package.json` on `origin/main` for the current version (first release ever starts from `1.0.0`, already set).

1. **Determine the version bump.** `$ARGUMENTS` may be `patch`, `minor`, or `major`. If it's none of those, show the operator the commit list from step 0 and ask (AskUserQuestion) which bump applies — don't guess a breaking change silently.

2. **Create the release branch.** Off the latest `origin/staging`: `git checkout -b release/vX.Y.Z origin/staging`.

3. **Bump the version.** `npm version <bump> --no-git-tag-version` (updates `package.json` + `package-lock.json` together — don't hand-edit the JSON). Commit as `chore: release vX.Y.Z`. Don't let `npm version` create its own tag (`--no-git-tag-version` handles that) — this command creates the real tag itself in step 6, on the actual `main` merge commit, not on the release branch.

4. **Push the release branch**, then **verify for real** before merging anything into production: run `npm run build` + `npm run lint` (the exact commands from `agent-hub/doctrine/MEMORY.md`) and read the output back verbatim. Either fails → stop, report the failure plainly, do NOT open the PR, do NOT tag, do NOT deploy. This project has no test suite — this build+lint pass is the only gate before something ships to real users.

5. **Open the release PR.** `gh pr create --base main --head release/vX.Y.Z --title "Release vX.Y.Z" --body "<commit list from step 0>"`.

6. **Merge with a real merge commit, not squash.** `gh pr merge <PR#> --merge --delete-branch` — a regular merge (unlike `/ship`'s squash) so `main` keeps `staging`'s individual commit history, giving real traceability of what shipped in this release. `--delete-branch` removes the temporary `release/vX.Y.Z` branch (never `main` or `staging` themselves).

7. **Tag.** `git fetch origin main`, then `git tag -a vX.Y.Z origin/main -m "Release vX.Y.Z"` and `git push origin vX.Y.Z`.

8. **Deploy if configured.** Check `$DEPLOY_HOOK_URL` (see root `CLAUDE.md`'s Environment Variables). Unset → print `deploy: not configured (set DEPLOY_HOOK_URL to enable)` and move on, this is not a failure. Set → `curl -fsS -X POST "$DEPLOY_HOOK_URL"`, report the real response/status code. A deploy failure here does NOT undo the merge or the tag — the release already happened; report the deploy failure plainly and let the operator retry the deploy separately.

9. **Sync the version bump back to `staging`.** `main` is now `staging` + the version-bump commit — `staging` needs that same commit so it doesn't drift. `gh pr create --base staging --head main --title "chore: sync vX.Y.Z back into staging" --body "..."`, then `gh pr merge <PR#> --merge` (regular merge, no `--delete-branch` — the head here is `main`, never delete it).

10. **Report.** New version, tag name + URL, release PR URL + merge commit SHA on `main`, sync-back PR URL, deploy result (or "not configured").

$ARGUMENTS
