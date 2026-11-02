# 2026-11-02 - hero-main-familiar-api (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `hero-main-familiar-api` (#366 follow-up), branch `feature/366`, uncommitted
- Notes graded: `evidence/implementer/2026-11-02/hero-main-familiar-api-plan.md`, `evidence/implementer/2026-11-02/hero-main-familiar-api-diff.md`
- New PM status: PENDING → SEALED (row collapsed to a pointer, full row appended to `haven/diagrams/dev-loop-archive.md`)

## Verdict: SEAL

## Reasoning
| Criterion | Evidence |
|---|---|
| 1. `Skills.vue`/`tsCodeLines.ts` back to `staging` behavior (no `mainSkills`/`familiarSkills` arrays in `skills.ts`) | Note: `skillsTsHasMain: false`, `utils/tsCodeLines.ts` reverted. Corroborated by `git diff --stat staging`, which has no `utils/tsCodeLines.ts` row. `Skills.vue` shows `43 +-----------------`, which fits only moving `SKILL_ICONS`/`skillIcon` out. The screenshot's `skills.ts` starts at line 1 with `enum SkillGroup {` and has no `const mainSkills`. |
| 2. Hero hardcoded `techStack`/`familiarStack` → `store.mainSkills`/`store.familiarSkills`, each list hidden when empty (familiar incl. label) | Diff row for `Hero.vue` (computed from the store, `v-if` per list). In the live browser exactly 1 `<ul>` follows the summary `<p>`, holding the 5 API names. The only "Familiar with" text is the `SkillGroup` enum value in `skills.ts` and the `__NUXT_DATA__` payload, so no hero label. Live data has no `familiarSkills`. |
| 3. Shared `utils/skillIcon.ts` (moved from `Skills.vue`), matches `JavaScript (ES6+)`/`Vue.js 2 & 3`/`SAPUI5`, unit test | New `utils/skillIcon.ts` + `utils/index.ts \| 1 +`. New `tests/skillIcon.test.ts`. `Tests  16 passed (16)` (14 → 16). Live img srcs: `js.svg`, `typescript.svg`, `vue-js.svg`, `sapui5.svg`, `git.svg`. |
| 4. Real browser on `/` with live API: 5 main chips with icons, no "Familiar with" block, `?tab=skills` has no `const mainSkills` | Playwright against `node .output/server/index.mjs` with the real `.env`, `/?tab=skills`, `visibilityState visible`, concrete values quoted above. I opened the screenshot `.playwright-mcp/hero-main-skills.png`. It shows `4+ năm kinh nghiệm — gần đây nhất tại Laidon Group`, then 5 chips with logos (JavaScript (ES6+), TypeScript, Vue.js 2 & 3, SAPUI5, Git), with no "Đã làm quen với" row. |
| 5. build + lint + typecheck + test clean | `◆ ✨ Build complete in 14.1s!`, lint exit 0 (`> eslint .`, no findings), typecheck exit 0 (no error lines), `Test Files  7 passed (7)` / `Tests  16 passed (16)`. The previously SEALED `main-familiar-skills` note gave the same level of detail. |
| comments per code-comments.md | Row present: the moved JSDoc is kept verbatim, the new `skillIcon` JSDoc and the 1-line Hero JSDoc explain why, and there are no issue refs. |
| Step 4 commands | `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, as in `doctrine/MEMORY.md`. The Typecheck row has no `baseline:`. |
| Step 5 truncation | None. The single `…` in img srcs abbreviates the repeated `/_ipx/s_24x24/svg/` prefix, which is quoted in full on the first src. It hides no output. |
| 7b Supersedes/Still open | `## Supersedes`: `main-familiar-skills` (SEALED), only its `skills.ts` rendering. `## Still open: none`. No other open #366 row is on the active diagram. |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. The node exists, both notes are written, there is no code in `haven/`, and PM status is updated here (DIAGRAM_DRIFT clear).
- Seal gate: `none`. Nothing committed or pushed.
- Proportionality: excluding the earlier SEALED node's files (fetchResume/types/store/test, unchanged), the diff is Hero.vue, Skills.vue, the new `utils/skillIcon.ts` and its export, and one new test. That is exactly what the node names. Net -33 lines vs `staging` across the branch.
- Carry into the PR (from `## Noticed, not done`):
  - On prod the hero "Familiar with" row disappears until the backend ships `familiarSkills` (datvt243/resume-nodejs-api#349). The familiar list with data present was not browser-checked.
  - The `skillIcon` normalization also gives icons in `skills.ts` to `JavaScript (ES6+)`/`Vue.js 2 & 3`.
  - The PDF doesn't show these lists.
  - Leave the untracked `review/` and `.playwright-mcp/` folders out of the commit.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool. The task string starts "You are the VERIFIER worker of the agent-hub in the repo ... Node: `hero-main-familiar-api` ... You are a separate subagent; you did NOT write this diff." It differs from the implementer's task string (the Vietnamese operator text). This context didn't write the diff and didn't open its content. It read the two notes, the diagram row, `git diff --stat staging`, the screenshot and the hub docs.

## Re-run
none. Audit only (the default). The output is quoted, the commands match MEMORY.md, and none of the three re-run exceptions applies (not outward-facing, not a `/release` gate, not listed in PROJECT.md). Viewing the existing screenshot is not a re-run.

## PM status
- `hero-main-familiar-api`: PENDING → SEALED, collapsed to a pointer, full row appended to `dev-loop-archive.md`.
- Per `## Supersedes` (step 11d), I appended the `main-familiar-skills` pointer row verbatim to the archive under `## Superseded by \`hero-main-familiar-api\` (2026-11-02)` and removed it from the active file. Its status stays SEALED (ratchet unaffected).
- The active file has 20 pointers, so nothing needed trimming.
