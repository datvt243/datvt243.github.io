# 2026-11-06 - skill-icons-390 (verdict)

- Worker: verifier · Version: 0.1.0
- Node: `skill-icons-390` (issue #390, branch `feature/390`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-06/skill-icons-390-diff.md` (plan: `skill-icons-390-plan.md`)
- Verdict: **SEAL** · New PM status: SEALED (archived)

## Isolation proof
This is a separate Agent-tool subagent with a fresh context. Its task string began "You are running `/worker verifier` for the agent-hub in the repo /Users/_david/Workspace/Project/resume/datvt243.github.io (branch `feature/390`, already checked out — do not switch branches, do not commit/push)" and named the note `agent-hub/evidence/implementer/2026-11-06/skill-icons-390-diff.md`. The implementer ran in the parent session as `/todo #390`. I did not write this diff.

## Re-run
none. Audit only. Read-only checks:
- `stat` mtimes: `utils/skillIcon.ts` 00:13:44, `tests/skillIcon.test.ts` 00:13:51, `.output/nitro.json` 00:14:23. The build is newer than every code edit. `express.svg`/`axios.svg` are newer (00:19:53, the wordmark-to-square swap). They are static `public/` copies whose names did not change, so the build, lint, typecheck and the `existsSync` test are unaffected.
- `git diff --stat -- utils tests`: 2 files, +51/−1.
- A grep of the 20 new SVGs for `<script`, `on*=` handlers and external `href`s found 0 hits. Together they are 45 365 bytes.
- `grep` of the one comment in `utils/skillIcon.ts` and of the `existsSync` test (`tests/skillIcon.test.ts:35-37`).
- I viewed `grid.png` and `skills-dark.png` from the scratchpad.

## Criteria
| Criterion (node row) | Verdict | Cited |
|---|---|---|
| (1) Every resume skill with a real logo gets an SVG + key, incl. `HTML5/SCSS` | met | Plan lists the unmatched skills before the change. The diff adds keys for HTML5/SCSS, Vuex, Vue Router, React Hooks, Express, Jest, Jira, ESLint, Prettier, Axios, ChatGPT and Claude. Test "matches the remaining resume skills that have a logo" (12 names) is inside `Tests  27 passed (27)`. In `skills-dark.png`, HTML5/SCSS shows the HTML logo, Vuex/Vue Router show Vue, React Hooks shows React, and Jest, ESLint, Prettier, Jira, Claude, ChatGPT and Express each show their own logo |
| (2) Common skills (CSS, Docker, Redis, PostgreSQL, Vitest, Figma, Linux, VS Code, jQuery, Vite, Webpack, npm) mapped | met | Test "matches common skills not in the resume yet" (12 names) passes. All 12 appear in `grid.png` |
| (3) No-logo skills still return `undefined` | met | Test "returns undefined…" covers `Composition API`, `SAP Fiori` and `i18n`. In `skills-dark.png`, SAP Fiori, UI5 Tooling, i18n and Composition API rows have no icon |
| (4) Legible on dark `rgb(2,6,23)` and light `rgb(255,255,255)` at 16/24px | met | `grid.png` (headless Chrome) shows all 20 icons at 16 and 24px on both backgrounds, and I checked it myself. Express (`#94a3b8`) and jQuery (`#0868ac`) are the faintest on dark but still readable. The light panel screenshot `skills-light.png` predates the Express swap, but `grid.png` is after it |
| (5) `tests/skillIcon.test.ts` covers the new keys and checks the files exist | met | The `existsSync(\`public/svg/${skillIcon(name)}.svg\`)` loop is at `tests/skillIcon.test.ts:35-37` and is inside `Tests  27 passed (27)` |
| (6) build + lint + typecheck + `npm test` clean | met | `Test Files  10 passed (10)` / `Tests  27 passed (27)`. Lint printed `> eslint .` with no findings (eslint prints nothing when clean). Typecheck exit 0. `◆ ✨ Build complete in 18.3s!`, and the one rollup WARN, which comes from generated `node_modules/.cache` code, is disclosed. The commands match the `doctrine/MEMORY.md` table, and the Typecheck row has no baseline. This excerpt-plus-exit format is the same as earlier seals (`resume-hr-emphasis-reopen.md`, `pdf-cv-filename-seal.md`). The `…` marks the middle of the build log being skipped, and the note says what is in that part |
| Browser check (issue: "kiểm tra trên trình duyệt thật") | met | Dev server on :3390 against the :4390 mock, `grep -c onrender` = 0. `/?tab=skills` has 30 `img[src*="svg/"]` and `broken: []` |
| Comments per code-comments.md | met | One WHY comment, `// Vuex and Vue Router ship under the Vue logo, React Hooks under React's` (`utils/skillIcon.ts:42`). It has no issue ref and states a non-obvious mapping reason |

## Forbidden states
None hit. The node row exists, the note exists, no code is in `haven/`, and the PM row moves forward from `sealed_pending_verifier` to SEALED here.

## Seal gate
No outward action in the diff (no commit or push), so it passes. The process breach is covered under Risk carried forward.

## Proportionality
It passes. The node scope covers 20 SVGs, about 30 map keys (aliases included) and test cases. `next-js.svg` (black on dark) and `sapui5.svg` were correctly left untouched and logged under Noticed.

## Supersedes
none. The note says `none`/`none`. The only #390 row on the active diagram was this one.

## Risk carried forward
- The implementer called the real resume backend twice: once with `curl`, and once from a dev server started without the mock env, which got a 502. This breaks the user's never-hit-the-real-backend rule. The note discloses it, and it can't be undone. All later checks used the mock.
- `next-js.svg` (`fill="#000000"`) is nearly invisible on the dark theme. It's an existing file and should become a new node if wanted.
- `skills-light.png` was taken before the Express swap. Light-mode proof for the final Express icon comes only from `grid.png`.

## PM status
`skill-icons-390` → SEALED. The full row is appended to `dev-loop-archive.md` and the active row is now a pointer. The active file had 21 pointer rows, so the oldest one (`experience-pug-piped`, 2026-11-02) was removed. Its full row is already in the archive at line 130.
