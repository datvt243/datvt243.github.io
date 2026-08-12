---
description: Log work-history, commit, push the current branch, and open a pull request (never pushes directly to main)
---

Finish the current bug/feature branch's work, in order:

1. **Guard**: check the current branch (`git branch --show-current`). If it's
   `main`, stop and tell the user — per `CLAUDE.md`, work must happen on a
   `bug/<n>` or `feature/<n>` branch (see `/start-work`). Do not commit or push
   to `main` from here.

2. **Lint-fix changed files**: same as `/ship` step 1 — `git status --short`
   (staged + unstaged), run `npx eslint --fix` on the `.vue`/`.ts`/`.js` subset,
   skip deleted files.

3. **Write/update today's work-history log entry**, per the "Agent Work Log"
   convention in `CLAUDE.md` — do this even if `/ship` already logged something
   earlier in this session, to make sure nothing is missed:
   - Look at everything about to be committed (`git status` + `git diff`) to know
     the true scope.
   - Target `agent-hub/histories/YYYY-MM-DD.md`; append a new `##` section if the
     file already exists today.
   - Cover: **Goal**, **What was done**, **Current state** (build/lint/test,
     what was verified and how), **Possible next steps**.

4. **Commit**: standard workflow — `git status`/`git diff`/`git log` in parallel
   first, draft a message focused on *why*, stage specific files (including the
   lint fixes and history file), commit with the `Co-Authored-By` trailer,
   verify with `git status` after.

5. **Push the branch**: `git push -u origin <branch>` if it has no upstream yet,
   otherwise `git push`. Invoking `/finish-work` is the explicit go-ahead — no
   need to ask first. If rejected (non-fast-forward), stop and report rather
   than force-pushing.

6. **Open a pull request** targeting `main`:
   `gh pr create --base main --head <branch> --title "..." --body "..."`. Include
   `Closes #<issue_number>` in the body (parse the issue number from the branch
   name, `bug/<n>` or `feature/<n>`) so merging auto-closes the issue. This
   command only opens the PR — it never merges it (see `/merge-work` for that).

7. Report the PR URL back to the user.

If there is nothing to commit and no open changes to turn into a PR, say so and
stop after step 1's guard check.

$ARGUMENTS
