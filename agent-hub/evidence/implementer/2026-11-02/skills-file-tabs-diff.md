# 2026-11-02 - skills-file-tabs (diff)
- Worker: implementer · Version: 0.1.0
- Node: `skills-file-tabs` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (#368, verbatim): "phần skill.ts, SkillGroup đang nằm đầu và thấy ko phải thông tin quan trọng, hãy design lại theo kiểu Tab, skill.ts và skill-group.ts, mặc định tab skills.ts và import skill-group vào"
- Status: sealed_pending_verifier
- Plan: `evidence/implementer/2026-11-02/skills-file-tabs-plan.md`

## Hub bytes before: 79741

## Diff
| File | Why |
|---|---|
| `utils/tsCodeLines.ts` | new `buildSkillGroupTsLines` (`export enum SkillGroup {…}`); `buildSkillsTsLines` drops the enum, starts with `import { SkillGroup } from './skill-group'` + blank line. Only caller: `Skills.vue` |
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | prop `file: 'skills.ts' \| 'skill-group.ts'` picks which lines to render |
| `themes/portfolio-dev/pages/resumeObject/Index.vue` | `skillFiles`/`skillFile` (default `skills.ts`); `#filetab` renders a `role=tablist` with 2 `role=tab` buttons (`aria-selected`, close icon on the active one) when `active === 'skills'`, else the existing single label; passes `:file="skillFile"` |
| `tests/tsCodeLines.test.ts` (new) | proves skills.ts has the import + no `enum`, skill-group.ts exports every group |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, verbatim from `doctrine/MEMORY.md`)

## Output
- build: exit 0 — `◆ ✨ Build complete in 14.1s!`
- lint: exit 0 — `> eslint .`, no findings
- typecheck: exit 0 — no error lines
- test: exit 0 — `Test Files  8 passed (8)` / `Tests  18 passed (18)`
- Real UI (Playwright, `node .output/server/index.mjs` :3456, real `.env`, tab selected first, visibilityState `visible`):
  - `/?tab=skills` on load: tabs `[{skills.ts, aria-selected "true"}, {skill-group.ts, "false"}]`; first lines `import { SkillGroup } from './skill-group'`, ``, `const skills: Record<SkillGroup, string[]> = {`, `[SkillGroup.Languages]: [`, ` 'JavaScript (ES6+)', // 4+ years`; `hasEnum: false`.
  - click `skill-group.ts`: tabs `skills.ts:false`, `skill-group.ts:true`; content `export enum SkillGroup {` … 9 members (`Languages` … `FamiliarWith = 'Familiar with',`) … `}`. Screenshot `.playwright-mcp/skill-group-tab.png`.
  - 375×800: `innerWidth 375`, `scrollWidth 360` (no horizontal page scroll); tab right edges 95 / 237. Screenshot `.playwright-mcp/skill-tabs-mobile.png`.
  - other section (click `experiences.pug`): `tablists: 0`, filetab `experiences.pug`.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) 2 tabs on skills, default skills.ts, single label elsewhere | load: `skills.ts` `aria-selected "true"`; experiences: `tablists: 0` |
| (2) skills.ts = import + const, no enum | first lines + `hasEnum: false`; unit test |
| (3) skill-group.ts = export enum, every group | 9 members after click; unit test |
| (4) real browser, desktop + 375px | Output above + 2 screenshots |
| (5) build+lint+typecheck+test | Output above |
| comments per code-comments.md | new JSDoc on `buildSkillGroupTsLines`, updated `buildSkillsTsLines` JSDoc, 1-line why on `skillFiles` (secondary info opens second); no issue refs |

## REOPEN 1 fixes (`evidence/verifier/2026-11-02/skills-file-tabs-reopen.md`)
1. **`personalSkills` in skills.ts** — re-checked in the real browser (same build, live `.env`, server restarted; tab selected first, visibilityState `visible`), `/?tab=skills`, selected tab `skills.ts`, 70 visible code lines:
   - line index 0: `import { SkillGroup } from './skill-group'`; `const skills` at index 2; `const personalSkills` at index 63; `hasEnum: false`; last line `]`.
   - block at index 62–65: ``, `const personalSkills: string[] = [`, `'Focus on writing clean, maintainable, and scalable code',`, `'Quick learner, able to adapt to new technologies',`.
   - Full-page screenshot: `.playwright-mcp/skills-ts-tab.png`.
2. **`.gitignore` `+.playwright-mcp`** — not written by this diff (mtime `Nov  2 07:40:25 2026`, during the Playwright session; the Playwright MCP tooling is the likely writer). Out of scope → reverted with `git checkout -- .gitignore`; `git status --short .gitignore` now empty. Diff table above is the complete set of tracked changes.

## Supersedes: none
## Still open: none

## Noticed, not done
- `.playwright-mcp/` (Playwright MCP screenshots/logs) is untracked and not ignored; a `.gitignore` entry would be a separate tooling change.
- Sub-tab isn't in the URL (`?tab=skills` always opens `skills.ts`) and has no keyboard shortcut — not asked; the outer sections' `?tab=` behavior untouched.
- No arrow-key navigation between the 2 `role=tab` buttons (each is a focusable button, Tab key reaches both).

## Seal gate: none (no commit/push)
