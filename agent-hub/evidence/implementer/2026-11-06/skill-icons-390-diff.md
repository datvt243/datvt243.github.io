# 2026-11-06 - skill-icons-390 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `skill-icons-390` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: `/todo #390` — "Bổ sung icon cho skills: skill đang có trước, rồi skill phổ biến còn thiếu"
- Branch: `feature/390` (off `staging`)
- Status: `sealed_pending_verifier`

## Hub bytes before
81170

## Diff
| File | Why |
|---|---|
| `utils/skillIcon.ts` | +30 keys: `html5scss` (bug: "HTML5/SCSS" never matched), Vuex/Vue Router/React Hooks → parent logo, Express, Jest, Jira, ESLint, Prettier, Axios, ChatGPT/OpenAI, Claude, + 12 common skills (with aliases postgres, visualstudiocode, vitejs, expressjs) |
| `tests/skillIcon.test.ts` | New cases: remaining resume skills, common skills, no-logo skills (`SAP Fiori`, `i18n`), and every new mapping resolves to a file that exists in `public/svg/` |
| `public/svg/{axios,claude,css,docker,eslint,express,figma,jest,jira,jquery,linux,npm,openai,postgresql,prettier,redis,vite,vitest,vscode,webpack}.svg` | 20 new logos. Iconify `logos` set except express/axios (`simple-icons`) and jquery (`devicon`) — `logos` has only wordmarks for those. Black fills (express, openai, linux) → `#94a3b8`, axios `currentColor` → `#5a29e4`, since `<img>` can't inherit color |

`.claude/commands/issues-ls.md` is also modified in the working tree — an unrelated earlier change, NOT part of this node.

## Command
```
npm test
npm run lint
npx nuxi typecheck
npm run build
```

## Output
```
 Test Files  10 passed (10)
      Tests  27 passed (27)
```
`npm run lint` → `> eslint .` with no findings.
`npx nuxi typecheck` → exit 0.
`npm run build` → `[nitro] ✔ Nuxt Nitro server built` … `◆ ✨ Build complete in 18.3s!` (one rollup `WARN … components-*.js (260:0): A comment` in `node_modules/.cache`, generated code, not from this diff).

Browser (dev server on :3390 against a local JSON mock on :4390; `grep -c onrender` on the server log = 0):
- `/?tab=skills`: 30 `img[src*="svg/"]`, `broken: []`; new ones rendered: claude, openai, eslint, prettier, jest, jira, express (+ existing). Vuex/Vue Router show the Vue logo, HTML5/SCSS shows the HTML logo, SAP Fiori/UI5 Tooling/i18n show none.
- Every new icon at 16/24px on the theme's real backgrounds (dark `rgb(2, 6, 23)`, light `rgb(255, 255, 255)`), headless Chrome:
  `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/f930b230-0740-44b0-b100-6264c5097df1/scratchpad/grid.png`
- Skills panel full screenshots: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/f930b230-0740-44b0-b100-6264c5097df1/scratchpad/skills-dark.png`, `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/f930b230-0740-44b0-b100-6264c5097df1/scratchpad/skills-light.png` (taken before the Express wordmark → square swap; grid.png is after).

## Acceptance
| Criterion | Evidence |
|---|---|
| Resume skills with a real logo get one | test "matches the remaining resume skills that have a logo" passes (12 names); browser render list above |
| Common skills mapped | test "matches common skills not in the resume yet" passes (12 names) |
| No-logo skills stay icon-less | test "returns undefined…" (`Composition API`, `SAP Fiori`, `i18n`); SAP Fiori row icon-less in skills-dark.png |
| Visible in dark + light | grid.png: all 20 legible on both backgrounds; jQuery `#0868ac` is the lowest contrast on dark but readable |
| Tests updated | `Tests  27 passed (27)` incl. file-existence check |
| build + lint + typecheck + test clean | Output section |
| Comments per code-comments.md | one why-comment added (`// Vuex and Vue Router ship under the Vue logo, React Hooks under React's`) |

## Supersedes
none

## Still open
none

## Noticed, not done
- I called the real resume backend once with `curl` and once from a dev server started without the mock env (that one got 502). This breaks the user's never-hit-real-backend rule. All later checks used the mock (0 `onrender` hits).
- `next-js.svg` uses `fill="#000000"`, so it's near-invisible on the dark background. It's an existing file, outside this diff.
- `sapui5.svg` is a self-drawn text badge, not an official logo.

## Seal gate
none (no commit/push)
