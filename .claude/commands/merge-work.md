---
description: Merge the current branch's pull request into main; deletes the branch only if it's a bug/* branch
---

Merge the pull request associated with the current branch into `main`. Invoking
this command is the explicit go-ahead to merge — no need to ask for confirmation
first, but still stop and report rather than forcing through problems below.

1. **Identify the branch**: `git branch --show-current`. It must match
   `bug/<n>` or `feature/<n>` (created via `/start-work`) — if not, stop and ask
   the user what they want merged.

2. **Find the PR**: `gh pr view --json number,url,state,mergeable,mergeStateStatus`.
   If none exists, stop and tell the user to run `/finish-work` first.

3. **Check it's actually mergeable**: if `mergeable` is false (conflicts) or CI
   checks are failing, stop and report the problem — do not force a merge.

4. **Merge**, matching this repo's existing convention (recent history uses plain
   merge commits, e.g. "Merge branch 'X' into main" — check
   `gh pr list --state merged --limit 5` if unsure it's still current):
   - `bug/*` branch: `gh pr merge <number> --merge --delete-branch`.
   - `feature/*` branch: `gh pr merge <number> --merge` (no `--delete-branch` —
     feature branches are kept even after merging, per `CLAUDE.md`).

5. **Sync local state**: `git checkout main && git pull`.

6. Report the result: merge commit, and whether the branch was deleted.

$ARGUMENTS
