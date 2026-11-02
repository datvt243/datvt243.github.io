# 2026-11-02 - hero-main-familiar-api (diff)
- Worker: implementer · Version: 0.1.0
- Node: `hero-main-familiar-api` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (operator, verbatim): "thay thế mainSkills và FamiliarSkill ở 2 mục bên dưới dòng 4+ năm kinh nghiệm, không phải ở skills.ts"
- Status: sealed_pending_verifier
- Plan: `evidence/implementer/2026-11-02/hero-main-familiar-api-plan.md`

## Hub bytes before: 79737

## Diff (vs `staging`; whitelist/type/store/test from SEALED `main-familiar-skills` unchanged)
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | `skills.ts` rendering of main/familiar reverted (`git checkout`); `SKILL_ICONS`/`skillIcon` moved out, imported from `@/utils/index` |
| `utils/tsCodeLines.ts` | reverted to `staging` (no `varName` param) |
| `utils/skillIcon.ts` (new) + `utils/index.ts` | shared icon lookup; strips a `(...)` note, then exact key, then key without trailing digits — so `JavaScript (ES6+)`→`js`, `Vue.js 2 & 3`→`vue-js`, `SAPUI5`→`sapui5` |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | hardcoded `techStack`/`familiarStack` → computed from `store.mainSkills`/`store.familiarSkills`; `v-if` hides each list (familiar incl. its label) when empty; icon `<NuxtImg>` only when matched; `:key` by name |
| `tests/skillIcon.test.ts` (new) | proves the API-name matching + undefined for no logo |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, verbatim from `doctrine/MEMORY.md`)

## Output
- build: exit 0 — `◆ ✨ Build complete in 14.1s!`
- lint: exit 0 — `> eslint .`, no findings
- typecheck: exit 0 — no error lines
- test: exit 0 — `Test Files  7 passed (7)` / `Tests  16 passed (16)`
- Real UI (Playwright, `node .output/server/index.mjs` :3456, real `.env` = live backend; live `generalInformation` has `mainSkills`, no `familiarSkills`), `/?tab=skills`, visibilityState `visible`:
  - summary `<p>`: `4+ năm kinh nghiệm — gần đây nhất tại Laidon Group`; `<ul>` siblings after it: exactly 1 list — `JavaScript (ES6+)` `/_ipx/s_24x24/svg/js.svg`, `TypeScript` `…/typescript.svg`, `Vue.js 2 & 3` `…/vue-js.svg`, `SAPUI5` `…/sapui5.svg`, `Git` `…/git.svg`.
  - `skillsTsHasMain: false`, `skillsTsHasPersonal: true`.
  - "Familiar with" text nodes on page: only `<span class="text-theme-code-string">'Familiar with'</span>` (a `SkillGroup` enum value inside `skills.ts`, API data) + the `__NUXT_DATA__` payload — no hero label.
  - Screenshot: `.playwright-mcp/hero-main-skills.png` (hero shows the 5 chips, no "Đã làm quen với" row).

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `skills.ts` back to staging behavior | `skillsTsHasMain: false`; `utils/tsCodeLines.ts` absent from diff |
| (2) Hero lists from store, hidden when empty | 1 `<ul>` after summary with the 5 API names; no hero familiar label |
| (3) shared `skillIcon` + test | `Tests  16 passed (16)` (2 new in `tests/skillIcon.test.ts`); 5/5 img srcs above |
| (4) real browser | Output above + screenshot |
| (5) build+lint+typecheck+test | Output above |
| comments per code-comments.md | moved JSDoc kept verbatim; new `skillIcon` JSDoc + 1-line Hero JSDoc explain why; no issue refs |

## Supersedes
- `main-familiar-skills` (SEALED) — only its `skills.ts` rendering (acceptance 3) is replaced; its whitelist/type/store/test stay.
## Still open: none

## Noticed, not done
- Visible change on prod: the hero's "Familiar with" row disappears until the backend deploys `familiarSkills` (datvt243/resume-nodejs-api#349, on backend `staging`). Not browser-checked with data present.
- `skillIcon` behavior change also applies in `skills.ts`: names like `JavaScript (ES6+)`, `Vue.js 2 & 3` now get icons there too (previously none).
- PDF resume doesn't show main/familiar skills — out of scope.

## Seal gate: none (no commit/push)
