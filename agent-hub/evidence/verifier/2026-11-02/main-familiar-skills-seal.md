# 2026-11-02 - main-familiar-skills (verifier: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `main-familiar-skills` (#366), branch `feature/366`, uncommitted
- Notes graded: `evidence/implementer/2026-11-02/main-familiar-skills-plan.md`, `evidence/implementer/2026-11-02/main-familiar-skills-diff.md`
- New PM status: PENDING → SEALED (row collapsed to a pointer, full row appended to `haven/diagrams/dev-loop-archive.md`)

## Verdict: SEAL

## Reasoning
| Criterion | Evidence |
|---|---|
| 1. `mainSkills`/`familiarSkills` in `PUBLIC_GENERAL_FIELDS` + `GeneralInformation`; unit test proves whitelist | Diff rows 1, 2, 6; `Tests  14 passed (14)` (existing whitelist test extended, count unchanged). `git diff --stat` lists `server/utils/fetchResume.ts | 2 ++`, `types/resume-document.ts | 2 ++`, `tests/fetchResume.test.ts | 10 ++++++++--`, which matches the table. |
| 2. store getters → `string[]` | Diff row 3 (`stores/resume.ts | 6 ++++++`), typecheck exit 0. |
| 3. `/` renders `const mainSkills` first, `familiarSkills` omitted when absent, live API, real browser | Live `/api/resume` keys quoted (has `mainSkills`, no `familiarSkills`). `/?tab=skills` innerText quoted verbatim: `const mainSkills: string[] = [ 'JavaScript (ES6+)', 'TypeScript', 'Vue.js 2 & 3', 'SAPUI5', 'Git', ]`, followed by `enum SkillGroup {`. Order indexes 432 < 554 < 2552, `hasFamiliar: false`, `visibilityState visible`. The quote is concrete and has no ellipsis. |
| 4. build + lint + typecheck + test clean | `◆ ✨ Build complete in 14.3s!`, lint exit 0 (`> eslint .`, no findings), typecheck exit 0, `Test Files  6 passed (6)` / `Tests  14 passed (14)`. Same detail level as the accepted `resume-isr-allow-lang` note. |
| comments per code-comments.md | Row present: only the `buildPersonalSkillsTsLines` JSDoc updated, no issue refs. |
| Step 4 commands | `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`, as in `doctrine/MEMORY.md`. The Typecheck row has no `baseline:`. |
| Step 5 truncation | None. |
| 7b Supersedes/Still open | Only #366 row on the active diagram is this node. `## Supersedes: none`, `## Still open: none` present. |

## Forbidden states / seal gate / proportionality
- Forbidden states: none hit. Node exists, notes written, no code in `haven/`, PM status updated here (DIAGRAM_DRIFT clear).
- Seal gate: `none`. Nothing committed or pushed.
- Proportionality: 25+/6- across the 6 files the task names. The default param on `buildPersonalSkillsTsLines` reuses the existing builder and adds no new helper.
- Carry into the PR (from `## Noticed, not done`): `familiarSkills`-present rendering wasn't seen in a browser because prod has no data yet (backend datvt243/resume-nodejs-api#349). The PDF resume doesn't show either list (out of scope). Leave the untracked `review/` and `.playwright-mcp/` folders out of the commit.

## Isolation proof
Spawned as a separate verifier subagent via the Agent tool. Task string starts "You are the VERIFIER worker of the agent-hub ... You are a separate subagent; you did NOT write this diff." It differs from the implementer's task string (the #366 Vietnamese task text). This context didn't write the diff and didn't open it. It read only the two notes, the diagram row, `git diff --stat` and the hub docs.

## Re-run
none. Audit only (the default). The output is quoted, the commands match MEMORY.md, and none of the three re-run exceptions applies: this isn't outward-facing or a `/release` gate, and PROJECT.md doesn't list this change class.

## PM status
`main-familiar-skills`: PENDING → SEALED, collapsed to a pointer, full row appended to `dev-loop-archive.md`. The active file then had 21 pointers, so I deleted the oldest (`vue-pin-no-override`), whose full row is already in the archive.
