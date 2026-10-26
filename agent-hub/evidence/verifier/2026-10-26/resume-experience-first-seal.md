# 2026-10-26 - resume-experience-first (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-experience-first` (issue #295, branch `feature/295`)
- New PM status: SEALED, archived per step 12. Full row appended to `haven/diagrams/dev-loop-archive.md`. The active row is now a pointer. The oldest pointer (`resume-tab-autoscroll`, already in the archive) was removed to keep 20 pointers.
- Notes audited: `evidence/implementer/2026-10-26/resume-experience-first-diff.md` (revised), `evidence/verifier/2026-10-26/resume-experience-first-reopen.md` (prior pass)

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** ... A previous verifier pass REOPENed it for paperwork only ... The implementer has now added that row ...". This spawn is the re-verify after REOPEN 1. Its task string differs from the implementer's #295 task and from the first verifier spawn. This context did not write the diff.

## Reasoning
| Check | Result |
|---|---|
| Missing item from the REOPEN | Fixed. The diff note's `## Acceptance` now has row 4, "comments per code-comments.md". It cites one `//` one-liner above `sections` that states WHY and has no `(#N)` refs. |
| Row 4 against the standard | Compliant. The line in `Index.vue` is `// First = default tab: experience is what a recruiter looks for, and the hero already covers about-me.` It is a single `//` sentence. It gives the WHY, not the WHAT. It has no issue/PR refs or narrated history, and no stacked `//` lines. |
| No code change since the REOPEN | `git diff --stat` shows `Index.vue` with 3 lines (+2/-1), the same as the prior pass's step-10 figure. The diagram has 1 line and `worker-runs.log` has 1 line. The `Index.vue` hunk is the single `sections` reorder plus the comment. |
| AC1, AC2, AC3, back/forward | Carried over from the prior pass's full re-run (`resume-experience-first-reopen.md`: build "Build complete in 17.9s!", lint rc=0, typecheck 0 "error TS", CDP 1440/390 × `/`,`/en`, deep links, keys 1–5, history). The code those results cover is unchanged. |
| Step 7b: Supersedes / Still open | The note has `## Supersedes` set to none. The active diagram has no other #295 row. |
| Step 8: forbidden states | None hit. ADHOC_WORK: no, the row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck is cited. CODE_IN_HAVEN: no. DIAGRAM_DRIFT: no. |
| Step 9: seal gate | No commit, push or PR. "none" is acceptable. |
| Step 10: proportionality | 3 lines in `Index.vue`. In proportion. |
| "tests pass" claim | Absent. |

## Re-run
partial: `npm run lint` only. The operator's spawn prompt required it, and it confirms the working tree still lints after the note-only revision. Build, typecheck and CDP were not re-run. No code changed since the prior pass re-ran all of them (full) with passing results.
```
npm run lint
> nuxt-app@1.5.1 lint
> eslint .
rc=0
```

## Missing
none.
