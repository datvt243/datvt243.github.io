---
description: Lint-fix changed files, commit, and push — no stop-for-approval (invoking this command IS the approval). Add --merge to also open a PR into staging and squash-merge it. For quick changes (docs/config); tracked bug/feature code work still prefers agent-hub (`/worker implementer`, `/todo`). Promoting staging to main is /release's job, not this command's.
---

Ship the pending changes in this repo, in this order:

0. **Guard**: check the current branch (`git branch --show-current`). If
   it's `main` **or** `staging`, stop and tell the user — both are
   GitHub-protected as of 2026-08-30, direct pushes aren't allowed even
   with this command. Branch as `bug/<issue_number>` or
   `feature/<issue_number>` off `staging` first (not `main` — `staging` is
   the integration branch now; `main` only ever receives code via
   `/release`). This guard is never skipped, `--merge` or not.

1. **Lint-fix changed files.** Get the changed files (`git status --short`,
   covering both staged and unstaged) and run `npx eslint --fix` on the
   subset ESLint covers in this repo (`.vue`/`.ts`/`.js` — see
   `eslint.config.js`). Skip files that were deleted. If `--fix` changes
   anything, that's expected — those diffs get included in the commit too.

2. **Commit**, following the repo's standard commit workflow (see the root
   `CLAUDE.md` / top-level agent instructions for the exact git steps: check
   `git status`/`git diff`/`git log` in parallel, draft a message focused on
   *why*, stage specific files — including the lint fixes from step 1 —
   commit with the `Co-Authored-By` trailer, verify with `git status` after).

3. **Push — no confirmation prompt.** Invoking `/ship` is itself the
   operator's go-ahead; don't stop and ask before `git push`. Run `git push
   -u origin <branch>` (plain `git push` if the branch already has an
   upstream). If the push is rejected (e.g. non-fast-forward), stop and
   report it plainly rather than force-pushing — that failure is not
   something to route around.

4. **No `--merge` flag → stop here.** Report the commit (`git log -1
   --stat`) and the push result, and mention that re-running with `--merge`
   would open a PR into `staging` and merge it.

5. **`--merge` flag → open and merge a PR into `staging`:**
   a. Parse the issue number from the branch name (`bug/<n>` or
      `feature/<n>`). If the branch doesn't match that pattern, proceed
      without a `Closes #<n>` line — don't invent an issue number.
   b. `gh pr create --base staging --head <branch> --title "<last commit
      subject>" --body "<last commit body>$( [ -n "$issue" ] && echo
      "\n\nCloses #$issue" )"` — reuse the commit message rather than
      writing a new one from scratch. Base is `staging`, never `main`.
   c. `gh pr merge <PR#> --squash --delete-branch` — both `bug/*` and
      `feature/*` branches may be deleted after merge.
   d. Report the PR URL and the merge result (squash commit SHA on
      `staging`). Note that this does NOT touch `main` — run `/release`
      separately to promote `staging` into `main`.

If there is nothing to commit (clean working tree), say so and stop after
step 1.

$ARGUMENTS
