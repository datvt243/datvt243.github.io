---
description: Lint-fix changed files and commit; stops for approval before pushing — for quick untracked changes (docs/config); tracked bug/feature work goes through agent-hub (`/worker implementer`, `/todo`)
---

Ship the pending changes in this repo, in this order:

0. **Guard**: check the current branch (`git branch --show-current`). If it's
   `main`, stop and tell the user — per `CLAUDE.md`, direct pushes to `main`
   aren't allowed. Branch as `bug/<issue_number>` or `feature/<issue_number>`
   off `main` first.

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

3. **Stop before pushing and ask for confirmation.** Unlike the old `/ship`,
   invoking this command is *not* itself a go-ahead to push — `agent-hub`'s
   seal gate (`agent-hub/CLAUDE.md`, `NORTHSTAR.md`, `BOOT.md`) treats
   `git push` as an outward-facing action that always needs explicit operator
   approval, no exceptions. Show the commit that was just made (e.g.
   `git log -1 --stat`) and ask before running `git push` (or
   `git push -u origin <branch>` if it has no upstream yet). If the push is
   rejected (e.g. non-fast-forward), stop and report it rather than
   force-pushing.

If there is nothing to commit (clean working tree), say so and stop after
step 1.

$ARGUMENTS
