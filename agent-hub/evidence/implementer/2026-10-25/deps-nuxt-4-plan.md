# 2026-10-25 - deps-nuxt-4 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-4` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #263 "chore(deps): Phase 3.6 — Nuxt 3→4 migration (incl. vue-router 5)" (Phase 3.6 of #266), branch `feature/263` off freshly pulled `staging` (`5fa6885`)

## Hub bytes before: 77921

## Live versions (npm view, 2026-10-25)
`nuxt@4` → 4.6.2 (= latest). Node local v24.19.0 (engine `^22.22.3 || ^24.15.0 || >=26`).

## Module compatibility (installed `dist/module.mjs` `compatibility.nuxt`)
@nuxt/ui 3.3.7 (to check after install), @nuxt/icon 1.15.0 `>=3.0.0`, @nuxtjs/i18n 10.6.0 `>=3.0.0-rc.11`, @pinia/nuxt 1.0.3 `^3.15.0 || ^4.0.0 || ^5.0.0`, @nuxt/image 2.2.0 (none declared).

## Baseline (staging, Nuxt 3.21.11, vue-router 4.6.4)
- `npm run build` rc=0; WARN lines: 5× `[plugin node-resolve] Could not resolve import "nuxt/server"` (@nuxt/image), 1× `"nuxt/server" is imported by …`, 1× chunk >500 kB.
- `npx nuxi typecheck` rc=0, 0 `error TS`.
- `npm audit` → `50 vulnerabilities (1 low, 1 moderate, 45 high, 3 critical)`.
- SSR HTML saved for 10 routes (all 200): `scratchpad/n4/base/*.html`.

## Acceptance criteria
See node row. Data-fetch call sites to review against Nuxt 4's `useAsyncData` changes (shared refs per key, `data` default `undefined`): `pages/index.vue:18`, `pages/blogs/[id].vue:20`, `PostCategories.vue:17`, `blogs/Index.vue:16`, `projects/Index.vue:11`, `github/Index.vue:9`.

## Files (expected)
`package.json`, `package-lock.json`, `nuxt.config.ts`, `pages/index.vue` / `projects/Index.vue` (api-resume key), whatever the codemod/typecheck surfaces; docs: `CLAUDE.md` stack line, `agent-hub/doctrine/MEMORY.md` stack, PROJECT.md `@nuxt/schema` trap row.

## Blockers
none — `.env` present locally (MY_EMAIL, NODE_API, GITHUB_*, PUPPETEER_EXECUTABLE_PATH). Vercel preview check is outside this pass (no push without /ship).
