# 2026-11-06 - skill-icons-390 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `skill-icons-390` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: `/todo #390` — "Bổ sung icon cho skills: skill đang có trước, rồi skill phổ biến còn thiếu"

## Hub bytes before
81170

## Code anchors
- `utils/skillIcon.ts` — `SKILL_ICONS` map + `skillIcon()` normalizer
- `tests/skillIcon.test.ts`
- `public/svg/` — logo files, rendered via `<NuxtImg>`/`<img>` (so no `currentColor`; monochrome logos use the `#94a3b8` grey `github.svg` already uses)
- Callers (unchanged): `themes/portfolio-dev/pages/resumeObject/{Hero,Skills,Hr}.vue`

## Skills in the resume data without an icon (before)
Fetched once from the resume API (see Noticed: it should have been the mock).
Unmatched: HTML5/SCSS (normalizes to `html5scss`, not a key), Vuex, Vue Router, React Hooks,
Express.js, Jest, Jira, ESLint, Prettier, Axios, ChatGPT, Claude, SAP Fiori, UI5 Tooling,
plus concept skills (Composition API, i18n, SOLID, OData, JSONModel, XML Views…).

## Decisions
- SAP Fiori / UI5 Tooling: no icon — the repo's `sapui5.svg` is a text badge, not an official logo; a Fiori one would be invented.
- Vuex / Vue Router → `vue-js`, React Hooks → `react-js`: both projects publish under the parent logo.
- ChatGPT → OpenAI mark.
- Concept skills: no icon (issue's "no generic/fake icon" rule).
- Popular list chosen: CSS, Docker, Redis, PostgreSQL, Vitest, Figma, Linux, VS Code, jQuery, Vite, Webpack, npm.
- Source: Iconify `logos` set (same source/format as existing `github.svg`); wordmarks (Express, Axios, jQuery in `logos`) replaced with square marks from `simple-icons`/`devicon` so they stay legible at 16px.
