# 2026-11-05 - ats-pdf-skills-heading (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `ats-pdf-skills-heading` (#395, branch `bug/395`, worktree `../wt-bug-395`)
- Note judged: `evidence/implementer/2026-11-05/ats-pdf-skills-heading-diff.md`
- Verdict: **SEAL**

## Isolation proof
Separate Agent-tool subagent spawned by the `/todo` orchestrator with the task string "You are the VERIFIER in this repo's agent-hub. Work ONLY in the git worktree `/Users/_david/Workspace/Project/resume/wt-bug-395` ... Run `/worker verifier` for node `ats-pdf-skills-heading` (GitHub issue #395)" — blank context, did not write the diff (diff not opened, only the note).

## Re-run
partial — re-ran only the PDF check (`npx vite-node --config vitest.config.ts scratchpad/ats395/render.ts scratchpad/ats395v`, pypdf text extraction), fixture data, no backend call. Reason: outward-facing node (the downloadable resume PDF recruiters/ATS sites read). build/lint/typecheck/test not re-run: the note's output matches the format accepted on prior seals and the commands match `doctrine/MEMORY.md`.

## Cited
| Criterion | Evidence |
|---|---|
| (1) vi heading `Kỹ năng (Skills)`, en stays `Skills` | Note PDF check + my re-run: vi `KỸ NĂNG (SKILLS)`, en `SKILLS` |
| (2) Skill lines unchanged | Re-run, both langs: `Frontend: Vue.js, TypeScript, Nuxt` / `Tools: Git, Docker` / `Khác: SAPUI5` (vi), `Other: SAPUI5` (en) |
| (3) build+lint+typecheck+test clean | Note: `build=0 ... Build complete in 14.8s!`, `lint=0`, `typecheck=0 ts_errors=0`, `Test Files  8 passed (8) / Tests  20 passed (20)`; commands match `doctrine/MEMORY.md` |
| (4) Printed PDF shows the heading change | Re-run vi.pdf/en.pdf, text above, next heading `KINH NGHIỆM LÀM VIỆC` / `EXPERIENCE` |
| Comments per code-comments.md | Note: one one-line `//` why-comment, issue ref removed per the Delete rule |

## Missing
none

## Forbidden states
none hit. Seal gate: no commit/push in the pass, none required.

## Proportionality
One string + one comment in `server/utils/createPDFAts.ts`, plus the node row. Matches the node.

## Still open (not blocking)
CV-review-website before/after check is manual for the operator (stated on the node and in the note).

## PM status
Row archived to `haven/diagrams/dev-loop-archive.md`, active row replaced by a pointer; 6 oldest pointer rows pruned to keep 20 (same 6 the `bug/392` verifier pruned, so the two branches' deletions match).
