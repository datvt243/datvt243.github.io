---
description: Lint-fix changed files, commit, log work-history, and push
---

Ship the pending changes in this repo, in this order:

0. **Guard**: check the current branch (`git branch --show-current`). If it's
   `main`, stop and tell the user — per `CLAUDE.md`'s Bug Fix / Feature Workflow,
   direct pushes to `main` aren't allowed. Use `/start-work` to create an issue +
   branch first, then `/finish-work` to open a PR instead.

1. **Lint-fix changed files.** Get the changed files (`git status --short`,
   covering both staged and unstaged) and run `npx eslint --fix` on the
   subset ESLint covers in this repo (`.vue`/`.ts`/`.js` — see `eslint.config.js`).
   Skip files that were deleted. If `--fix` changes anything, that's expected —
   those diffs get included in the commit too.

2. **Write/update today's work-history log entry**, per the "Agent Work Log"
   convention in `CLAUDE.md`:
   - Look at everything that's about to be committed (`git status` + `git diff`,
     staged and unstaged, whichever will be included) to know the true scope —
     don't rely on conversation memory alone, since a session may cover more or
     less than what's actually being shipped right now.
   - Target `agent-hub/histories/YYYY-MM-DD.md` for today's date. If it already
     exists, append a new `##`-level section instead of overwriting it.
   - Write one entry covering everything in *this* commit — batched, not one
     entry per small step. Cover at minimum: **Goal** (the actual ask, not a
     diff restatement), **What was done** (concrete steps/decisions, including
     anything deliberately left alone and why), **Current state** (build/lint/
     test status, what was verified and how), **Possible next steps**.

3. **Commit**, following the repo's standard commit workflow (see the root
   `CLAUDE.md` / top-level agent instructions for the exact git steps: check
   `git status`/`git diff`/`git log` in parallel, draft a message focused on
   *why*, stage specific files — including the lint fixes from step 1 and the
   history file from step 2 — commit with the `Co-Authored-By` trailer, verify
   with `git status` after).

4. **Push** the current branch (`git push`, or `git push -u origin <branch>` if
   it has no upstream yet). Invoking `/ship` is itself the explicit go-ahead to
   push — no need to ask for confirmation first. If the push is rejected (e.g.
   non-fast-forward), stop and report it rather than force-pushing.

If there is nothing to commit (clean working tree), say so and stop after step 1
— don't fabricate a history entry for no change.

$ARGUMENTS
