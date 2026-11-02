# 2026-11-02 - main-familiar-skills (diff)
- Worker: implementer · Version: 0.1.0
- Node: `main-familiar-skills` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: "#366 Hiển thị mainSkills và familiarSkills từ resume API — thêm vào whitelist PUBLIC_GENERAL_FIELDS (server/utils/fetchResume.ts) + types, expose qua useResumeStore, hiển thị trong theme; rỗng/thiếu → không render (familiarSkills chưa deploy trên backend prod, shape [{name}])"
- Status: sealed_pending_verifier
- Plan: `evidence/implementer/2026-11-02/main-familiar-skills-plan.md`

## Hub bytes before: 79735

## Diff
| File | Why |
|---|---|
| `server/utils/fetchResume.ts` | `'mainSkills'`, `'familiarSkills'` added to `PUBLIC_GENERAL_FIELDS` — otherwise stripped by the whitelist |
| `types/resume-document.ts` | `mainSkills?`/`familiarSkills?: ProfessionalSkill[]` on `GeneralInformation` (optional: `familiarSkills` not on prod yet) |
| `stores/resume.ts` | `mainSkills()`/`familiarSkills()` getters → `string[]`, same pattern as `personalSkills()` |
| `utils/tsCodeLines.ts` | `buildPersonalSkillsTsLines(names, varName = 'personalSkills')` — reused for the two new arrays; existing caller unchanged |
| `themes/portfolio-dev/pages/resumeObject/Skills.vue` | `const mainSkills` before the `SkillGroup` block, `const familiarSkills` after it, each only when non-empty |
| `tests/fetchResume.test.ts` | whitelist test now asserts both fields survive `fetchResume` |

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, verbatim from `doctrine/MEMORY.md`)

## Output
- build: exit 0 — `◆ ✨ Build complete in 14.3s!`
- lint: exit 0 — `> eslint .` with no findings (0 lines matching "error")
- typecheck: exit 0 — no error lines
- test: exit 0 — `Test Files  6 passed (6)` / `Tests  14 passed (14)`
- Real UI (Playwright, built server `node .output/server/index.mjs` on :3456, real `.env` = live backend):
  - `GET /api/resume` → `generalInformation` keys `['career', 'foreignLanguages', 'mainSkills', 'openToWork', 'personalSkills', 'positionDesired', 'professionalSkills', 'professionalSkillsGroup', 'yearsOfExperience']`, `familiarSkills` absent.
  - `/?tab=skills` (visibilityState `visible`) innerText: `const mainSkills: string[] = [ 'JavaScript (ES6+)', 'TypeScript', 'Vue.js 2 & 3', 'SAPUI5', 'Git', ]` then `enum SkillGroup {`; indexOf order `const mainSkills`=432 < `SkillGroup`=554 < `const personalSkills`=2552; `hasFamiliar: false`.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) whitelist + type + unit test | diff rows 1–2, 6; `Tests  14 passed (14)` |
| (2) store getters | diff row 3; typecheck exit 0 |
| (3) UI renders mainSkills first, familiarSkills omitted when absent | Playwright excerpt + index order above; `hasFamiliar: false` with live API lacking the field |
| (4) build+lint+typecheck+test clean | Output section |
| comments per code-comments.md | only the `buildPersonalSkillsTsLines` JSDoc updated to its new behavior; no issue refs |

## Supersedes: none
## Still open: none

## Noticed, not done
- `familiarSkills`-present rendering not shown in a browser: prod backend doesn't return it yet (datvt243/resume-nodejs-api#349, on backend `staging`). Same code path as `mainSkills` with a different var name.
- PDF resume (`server/utils/createPDFAts.ts`) does not show main/familiar skills — not in #366's scope.
- `buildPersonalSkillsTsLines` name is now slightly narrow for its use; not renamed (SmallestDiff).

## Seal gate: none (no commit/push)
