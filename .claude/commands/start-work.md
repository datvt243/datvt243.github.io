---
description: Create a GitHub issue, sync main, and check out a new bug/feature branch
---

Start new tracked work in this repo, in order:

1. **Classify the work** as `bug` or `feature` from `$ARGUMENTS`/conversation
   context. If it's genuinely ambiguous, ask the user rather than guessing.

2. **Create a GitHub issue**: `gh issue create --title "..." --body "..."`. Title
   should be short and specific; body should capture what's known so far (repro
   steps for a bug, scope/acceptance criteria for a feature). Parse the issue
   number out of the URL `gh` prints.

3. **Sync `main`**:
   - `git status` first. If there are uncommitted changes, stop and ask the user
     what to do with them (stash / commit / discard) rather than doing it
     yourself — do not silently discard work.
   - `git checkout main && git pull`.

4. **Create and check out the branch**: `git checkout -b <bug|feature>/<issue_number>`
   (e.g. `bug/123`, `feature/124`) — per the naming rule in `CLAUDE.md`.

5. Report back: the issue URL and the branch name now checked out. Then proceed
   with the actual work the user described.

$ARGUMENTS
