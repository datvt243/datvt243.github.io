# 2026-11-22 - resume-view-url (verdict)

- Worker: verifier · Node: `resume-view-url` · New PM status: SEALED
- Verdict: SEAL

## Isolation proof
Spawned as a separate subagent via the Agent tool, description "agent-hub verifier resume-view-url" (task string: "You are the agent-hub verifier ... Node slug: resume-view-url"); blank context, only the two implementer notes were read, the diff was not opened. Fresh spawn, not a resume.

## Reasoning
- Command match: `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test` = `doctrine/MEMORY.md` rows. Outputs verbatim: build exit 0 "Build complete in 15.4s" (one WARN in a generated Nuxt chunk, not in the diff), lint exit 0, typecheck exit 0 with no error lines (no `baseline:` row), `Tests  28 passed (28)`. Not cut.
- Feature doc `resume-view-toggle.md` acceptance, one by one: 1 lines 2-3; 2 lines 5, 21c; 3 lines 1-3 (`hist` 2/2/2); 4 line 11 + `curl ... | grep -c experiences.pug` = 1; 5 line 14 and fresh `/` lines 1/21a; 6 lines 6-8; 7 line 9 (`/en?view=hr`, HR); 8 lines 15-16 (`/?tab=skills`, `skillsTab:true`); build/lint/typecheck/test above. Edge cases: lines 12, 13, 20. Behavior 10/11: lines 18, 19, 23.
- UI evidence is concrete (per-step URL, HR/dev panel presence, history length), real clicks in headless Chrome; page brought to front and `visibility visible` logged before step 15. Mock backend: `grep -c onrender server.log` = 0.
- Comments per code-comments.md: 5 touched comments, WHY-only, no `(#N)`. Coverage claim cites `grep -rn "useResumeView"` + output.
- `## Feature doc changed` carries the operator's recorded answer (Q4). `## Review` present: 7 findings, all fixed or resolved by operator. `## Supersedes: none`; `grep #422` on diagram showed no other open row.
- Forbidden states: none hit (node row exists, evidence written, diagram updated here). Seal gate: none needed, no outward action. Proportionality: Header.vue change goes beyond the plan's "unchanged" but is explained in the diff note (review finding 4/5) and stays small.

## Re-run
none (audit-only; no outward-facing action, note verbatim and complete).

## Doctrine proposal
none.

## Noted
Review was not re-run on the final diff (stated in the note); not a REOPEN reason, final diff covered by build/lint/typecheck/test + browser run.
