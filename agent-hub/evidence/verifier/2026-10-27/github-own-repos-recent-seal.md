# 2026-10-27 - github-own-repos-recent (SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `github-own-repos-recent` (issue #299 code part, branch `feature/299`, uncommitted)
- Note graded: `evidence/implementer/2026-10-26/github-own-repos-recent-diff.md` (pass 2, after `github-own-repos-recent-reopen.md`)
- Verdict: **SEAL**

## Isolation proof
This is the same separate verifier subagent that wrote REOPEN 1. The coordinator spawned it with the task string "You are the agent-hub **verifier** ... Node `github-own-repos-recent`, issue #299 ...". The pass-2 fix came back as the coordinator message "your REOPEN 1 is fixed and the change is ready for re-verification (pass 2)". This context did not write `server/api/github.ts` or `Item.vue`.

## Re-run
partial: build, lint, typecheck, `/api/github`, CDP `/en/github`. Reasons: the node is outward-facing (production `/github`), and the coordinator asked for an independent check.

## Commands + output (this pass)
```
npm run build → rc=0, "◆ ✨ Build complete in 16.8s!"
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
/api/github (:4155, real GitHub API unauthenticated): 22 repos, forks 0, null pushed_at 0, Vue 6
/en/github CDP :9888 incognito, after hydration:
  {"n":22,"first6":["resume-vuejs-website","datvt243.github.io","resume-nodejs-api","datvt243","mrpc-music-player-client","vscode-settings"],
   "hasFork":false,"dates":22,"first8":["10/26/2026","10/26/2026","10/25/2026","10/24/2026","8/9/2026","5/7/2026","12/4/2024","11/29/2024"],
   "nonInc":true,"vueFilter":6,"errs":[]}   (errs includes console warnings and page errors)
```

## Criteria
| Criterion | Evidence |
|---|---|
| 1. No forks, recent first | hasFork false / forks 0. All 22 dates shown on the cards are non-increasing; card 6 now shows 5/7/2026, where REOPEN 1 saw 10/26/2026 |
| 2. Language filter works, no console errors | Vue filter → 6 cards, equal to the 6 Vue repos in the API; errs [] |
| 3. build/lint/typecheck; comments per code-comments.md | rc=0, rc=0, 0 TS errors. `github.ts` has one `//` comment that explains WHY. The `Item.vue` JSDoc gives the WHY for using `pushed_at` (the sort key; `updated_at` moves on non-code edits), with no `(#N)` and no stacked `//` |

REOPEN 1's missing item (the shown date did not match the sort key) is resolved.

## Forbidden states
None hit. The diff stays minimal: 2 code files and one field swap for the fix. Seal gate: none needed before the PR. The PR uses `Refs #299` because the profile part is still open.

## Noticed (not blocking)
- The implementer's diff table omits `Item.vue`, and the `## Supersedes` block keeps a stray "none" line after the REOPEN 1 entry. The pass-2 re-check is a single line after `## Seal gate`. Note hygiene only; the evidence itself is present.
- `pushed_at` is typed as `string` in `types/github.ts:90`. An empty repo (null `pushed_at`) would show 1/1/1970. There are none today.
- Pagination beyond 100 repos and the 12-day handler cache are acknowledged in the implementer note.
