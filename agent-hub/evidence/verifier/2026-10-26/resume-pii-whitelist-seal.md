# 2026-10-26 - resume-pii-whitelist (verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `resume-pii-whitelist` (issue #280, branch `bug/280`)
- New PM status: SEALED
- Notes audited: `evidence/implementer/2026-10-26/resume-pii-whitelist-plan.md`, `evidence/implementer/2026-10-26/resume-pii-whitelist-diff.md`

## Isolation proof
This pass was a separate subagent, spawned by the `/todo` orchestrator through the Agent tool with the description "Verifier pass for resume-pii-whitelist". The implementer's task string was `/todo "fix P0"`, the #280 pass, as both of its notes record. This context did not write the diff. It never opened `server/utils/fetchResume.ts` or its diff. It only ran `git diff --stat`, which lists `server/utils/fetchResume.ts` (+45/-1) and the diagram. That matches the note's `## Diff` table.

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck` were all run (cold cache: `rm -rf .nuxt .output node_modules/.cache` first). No made-up `npm test`. |
| Step 5: truncation | No `...` or "truncated" in the output. The note gives rc and the key line for each command: "Build complete in 13.8s!" with WARN 0, lint `> eslint .` only, typecheck with 0 "error TS" and its last line quoted. |
| Step 6: visual | The note says N/A with concrete evidence of no change: "visible text identical: True" for `/`, `/en` and `/en/projects`, and both PDFs "identical (minus dates): True". This is a concrete diff, not "looks fine". |
| AC1: `/api/resume` has no salaryDesired/birthday/marital/gender | Note: the base "api keys:" list contains all four, and the fix list is only `"position"`. The note explains this is nested `experiences[]/projects[].position`, and the top level `position` is in the "dropped top-level" list. **My re-run (below) confirms it.** |
| AC2: SSR HTML of `/` has none | Note: `fix/html_.html:` (also `/en`, `/en/projects`) is empty, while base had `"gender" birthday levelDesired marital salaryDesired`. **My re-run confirms it.** |
| AC3: rendered content unchanged | Note: "visible text identical: True" ×3, "kept fields equal: True", and cv-en/cv-vi PDFs identical minus dates. |
| AC4: build/lint/typecheck clean | Note: rc=0 ×3, WARN 0, 0 "error TS". |
| AC5: comments per code-comments.md | Note: one `/** */` block (WHY: private fields would reach the API and SSR payload), no `(#N)` refs, no comment on `pick`. I accept this as cited. I did not open the code, per `EvidenceOnly`. |
| Step 7b: Supersedes / Still open | The note has `## Supersedes: none` and `## Still open: none for #280`. The active diagram has no other #280 row. |
| Step 8: forbidden states | ADHOC_WORK: no, the node row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, typecheck output is cited. CODE_IN_HAVEN: no, only the diagram changed under `haven/`. DIAGRAM_DRIFT: no, the row is IN_PROGRESS and becomes SEALED here. |
| Step 9: seal gate | No commit, push or PR. The only outward call was a read-only GET to the upstream resume API during verification, which the build and SSR make anyway. "none" is acceptable. |
| Step 10: proportionality | One source file (+45/-1), and that file is the single choke point for `/api/resume` and `/api/generate-pdf`. Nested-item backend IDs were left alone and listed under "Noticed, not done". In proportion. |
| Plan vs note consistency | The plan said "`.env` present". The diff note corrects this explicitly in "Env note (correction…)" and states where the values came from. That is acceptable. |

## Re-run
partial: I ran `npm run build` (warm cache) and served `.output` on :4131 with the env from `scratchpad/p0/env.sh`, then requested `GET /api/resume` and `GET /`. I did not re-run lint, typecheck, the PDF diff or a browser check. The reason is the outward-facing exception in "Re-run scope": this is a privacy fix to a public API response and the SSR payload, so I confirmed AC1 and AC2 independently. Output:
```
npm run build → rc=0, "◆ ✨ Build complete in 13.3s!"
  1 WARN: node_modules/.cache/nuxt/.nuxt/dist/server/_nuxt/components-BKndnV3n.js (369:0): A comment "/* @__NO_SIDE_EFFECTS__ */"
/api/resume → HTTP 200, 10732 bytes
/ → 89981 bytes
api hits (salaryDesired|birthday|marital|gender|levelDesired|workLocation): (none)
html hits (salaryDesired|birthday|marital|"gender"|levelDesired): (none)
kept sample: "experiences" "firstName" "foreignLanguages" "positionDesired" "professionalSkills"
```
The one WARN is a Rollup annotation notice in the generated client components chunk on a warm-cache build. It is not in `server/utils/`, and the implementer's cold-cache build reported WARN 0. It does not block this node.

## Missing
none
