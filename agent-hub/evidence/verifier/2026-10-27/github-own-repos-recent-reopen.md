# 2026-10-27 - github-own-repos-recent (REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `github-own-repos-recent` (issue #299 code part, branch `feature/299`, uncommitted)
- Note graded: `evidence/implementer/2026-10-26/github-own-repos-recent-diff.md`
- Verdict: **REOPEN**

## Isolation proof
Separate Agent-tool subagent spawned by the coordinator with the task string "You are the agent-hub **verifier** ... Node `github-own-repos-recent`, issue #299 ... Report SEAL or REOPEN briefly", resumed after a session-limit reset. It is not the implementer's context.

## Re-run
partial: build, lint, typecheck, `/api/github`, CDP `/en/github`. Reasons: the coordinator asked for a re-check, and the node is outward-facing (production `/github`).

## Commands + output (this pass)
```
npm run build → rc=0, "◆ ✨ Build complete in 20.1s!"
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
/api/github (:4155, real GitHub API unauthenticated): repos 22 forks 0; pushed_at desc True; updated_at desc False
/en/github CDP :9888 incognito: 22 repo links, hasFork false, console errors []
  Python filter (after hydration) → ["python-learing"]
  dates rendered on cards 1-8: 10/26/2026, 10/26/2026, 10/25/2026, 10/24/2026, 8/9/2026, 10/26/2026, 12/4/2024, 11/29/2024
```

## Criteria
| Criterion | Result |
|---|---|
| 1. No forks, recent first | No forks: met. Order: **the order contradicts the date the page shows** (below) |
| 2. Filter works / no console errors | met (Python → 1 repo; errors []) |
| 3. build/lint/typecheck; comments per code-comments.md | met; the single `//` comment explains WHY and has no `(#N)` |

## Missing
- The list is sorted by `pushed_at` (`?sort=pushed`), but each card shows `updated_at` (`themes/portfolio-dev/pages/github/part/Item.vue:42`). On the live page, card 6 `vscode-settings` shows **10/26/2026** directly after card 5 showing **8/9/2026**. The same out-of-order dates appear at positions 12/13 (`react-todo-list` 2024-03-23 above `vue-itunes-api` 2024-03-23 pushed earlier), 15 (2021-09-29 above 2021-09-12) and 20 (2021-09-12 below 2021-09-11). The operator chose "sort by most recent update"; a visitor sees a list whose shown update dates are not sorted. The implementer's note did not consider pushed vs updated.
- Smallest fix: make the shown date match the sort key. Either show `pushed_at` on the card (one field in Item.vue, plus updating its JSDoc), or switch to `sort=updated`. Prefer `pushed_at`: `updated_at` also moves on metadata/star edits, so a stale repo would float to the top. That is why `vscode-settings` reads 10/26/2026 with no push since May.

## Forbidden states
None hit. No seal-gate approval is needed before the PR (the change is not yet deployed).

## Noticed (not blocking)
- Pagination beyond 100 repos and the 12-day cache are acknowledged in the implementer note; acceptable at 25 repos.
- `Refs #299` (not `Closes`) is correct: the profile edits remain open.
