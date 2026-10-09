---
description: "List open GitHub issues for this repo, if it's hosted on GitHub. Read-only, no side effects."
argument-hint: "[--state open|closed|all] [gh issue list flags...]"
---

# /issues-ls — list GitHub issues for this repo

Read-only. Lists issues from GitHub if (and only if) this repo's remote is
a GitHub repo — no writes, no approval gate needed.

## Steps
1. **Check the remote is GitHub.** Run `git remote get-url origin` (fall
   back to another remote if `origin` doesn't exist). If it doesn't
   resolve, or the host isn't `github.com`, stop and report "not a GitHub
   repo — skip" — not an error, just nothing to do.
2. **Check `gh` CLI is available and authenticated.** Run `gh auth
   status`. If `gh` isn't installed or isn't authenticated, stop and
   report the exact output plus a one-line hint (`gh auth login`) — don't
   work around it (no calling the GitHub REST API directly with a token).
3. **List issues.** `gh issue list --state open --limit 50 --json
   number,title,labels,state,updatedAt,url` by default. If `$ARGUMENTS`
   is given, pass it through verbatim as extra flags to `gh issue list`
   instead of `--state open --limit 50` (e.g. `/issues-ls --state all`,
   `/issues-ls --label bug --assignee @me`), still adding the `--json`
   field list above unless the arguments already include their own
   `--json`.
4. **Reclassify OPEN issues already done on the integration branch.**
   Only if this project uses an integration branch separate from the
   default branch (e.g. `staging` → `main`, per
   `agent-hub/doctrine/domains/PROJECT.md`'s git workflow; none → skip
   this step). `Closes #n` only auto-closes on a merge into the *default*
   branch, so an issue merged into `staging` stays GitHub `OPEN` until
   `/release` ships it. Detect that instead of echoing raw state:
   - `gh pr list --base <integration-branch> --state merged --limit 100
     --json number,body,mergedAt`.
   - From each PR body, extract issue numbers with the same pattern
     `/release` uses: `/\b(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#(\d+)/gi`.
     Non-keyword mentions (e.g. "related to #72") don't count.
   - Any of those still `OPEN` in step 3's listing → display state
     **`done-dev`** (merged into the integration branch, not released
     yet). Everything else keeps its raw state.
5. **Display as a table**: issue number, title, **Status**, labels,
   state, updated-at, URL.
   - **Status** comes from the issue's `status: <value>` label(s) (e.g.
     `status: pending` → `pending`, `status: waiting-backend` →
     `waiting-backend`) — GitHub's own state is only `OPEN`/`CLOSED`, so
     a `status:` label is where finer-grained status lives. None → `—`;
     several → all, comma-separated. Leave `status: *` labels out of the
     Labels column so they aren't listed twice.
   - **State** is raw `OPEN`/`CLOSED`, or `done-dev` per step 4.
   - Don't re-fetch per issue — steps 3-4 already pulled everything.
6. **No writes.** Never close/comment/edit/label an issue from this
   command — that's a separate manual `gh issue` call (or `/release`'s
   own issue-closing step), out of scope here. Step 4's `done-dev` is a
   relabel in THIS command's output only, not a GitHub mutation.

## Runtime
Requires `gh` CLI authenticated against the project's GitHub remote. If
the repo isn't on GitHub, or `gh` isn't set up, report why and stop — no
fallback to scraping or an unauthenticated API call.
