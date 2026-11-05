# 2026-11-05 - ats-pdf-skills-heading (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `ats-pdf-skills-heading` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #395 "Resume PDF: CV review/ATS sites fail to detect skills". Branch `bug/395` off `staging` 283f0a1 (created with `gh issue develop`, worked in the git worktree `../wt-bug-395` because `bug/392` holds uncommitted sealed work), via `/todo "fix tất cả các issue bug"`.
- Fix chosen by the operator (AskUserQuestion): bilingual vi heading, over one-skill-per-line or both.
- Status: `sealed_pending_verifier`

## Hub bytes before
80619 (measured before the node row was appended)

## Diff
| File | Why |
|---|---|
| `server/utils/createPDFAts.ts` | `VI_HEADINGS.skills`: `'Kỹ năng'` → `'Kỹ năng (Skills)'`, with a one-line why comment. en heading and the skill lines are untouched. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (worktree root, from `doctrine/MEMORY.md`; `node_modules` is a symlink to the main checkout's)

## Output
```
npm run build → build=0, ◆ ✨ Build complete in 14.8s!
npm run lint → lint=0
npx nuxi typecheck → typecheck=0 ts_errors=0
npm test → Test Files  8 passed (8) / Tests  20 passed (20)
```

## PDF check (fixture data, no backend call)
`scratchpad/ats395/render.ts` (`npx vite-node --config vitest.config.ts`) imports this worktree's `pageRenderAts`, feeds a fixture with groups `Frontend`/`Tools` and one ungrouped skill, prints vi + en PDFs with puppeteer-core + local Chrome, text extracted with pypdf:
```
== vi
KỸ NĂNG (SKILLS)
Frontend: Vue.js, TypeScript, Nuxt
Tools: Git, Docker
Khác: SAPUI5
KINH NGHIỆM LÀM VIỆC
== en
SKILLS
Frontend: Vue.js, TypeScript, Nuxt
Tools: Git, Docker
Other: SAPUI5
EXPERIENCE
```

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) vi heading `Kỹ năng (Skills)`, en stays `Skills` | PDF text `KỸ NĂNG (SKILLS)` (vi; uppercase from the `.heading` CSS), `SKILLS` (en) |
| (2) Skill lines unchanged | `Frontend: Vue.js, TypeScript, Nuxt` / `Tools: Git, Docker` / `Khác`/`Other: SAPUI5`, same `<group>: a, b` shape in both |
| (3) build+lint+typecheck+test clean | `build=0`, `lint=0`, `typecheck=0 ts_errors=0`, `Tests  20 passed (20)` |
| (4) Printed PDF shows the heading change | PDF check above |
| Comments per code-comments.md | One `//` why-comment, no issue ref (removed per the Delete rule), one line |

## Supersedes
none

## Still open
- #395's "Checked with at least one CV review website before/after" needs the operator to upload the deployed PDF.

## Noticed, not done
- Other vi headings (`Kinh nghiệm làm việc`, `Học vấn`…) are vi-only too; the issue reports only skills, so not changed.

## Seal gate
none (no commit/push in this pass)
