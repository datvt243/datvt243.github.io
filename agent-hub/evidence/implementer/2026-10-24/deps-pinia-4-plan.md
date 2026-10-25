# 2026-10-24 - deps-pinia-4 (plan)

- Worker: implementer · Version: 0.1.0
- Node: `deps-pinia-4` (new row, appended; slug grepped in both diagram files → 0 hits)
- Task: `/todo` "xử lý nhóm A" → issue #265 "chore(deps): Phase 3.1 — pinia 2→4 + @pinia/nuxt 0.5→1" (https://github.com/datvt243/datvt243.github.io/issues/265), branch `feature/265` off freshly pulled `staging`.

## Hub bytes before: 76703

## Live re-verify (immediately before bump)
- `npm view "pinia@^4" version` → `pinia@4.1.0 '4.1.0'`
- `npm view "@pinia/nuxt@^1" version` → `@pinia/nuxt@1.0.3 '1.0.3'`
- `@pinia/nuxt@1.0.3` module meta `compatibility.nuxt: "^3.15.0 || ^4.0.0 || ^5.0.0"`; repo nuxt 3.21.11.

## Baseline (on feature/265 before any change)
- `npx eslint .` → no output (0 problems)
- `npx nuxi typecheck` → rc=0, 0 `error TS`
- `npm audit` → `60 vulnerabilities (1 low, 3 moderate, 52 high, 4 critical)`

## Files / anchors
- `package.json`, `package-lock.json`
- Store: `stores/resume.ts` (options-API `defineStore`, `this.generalInformation` in getters)
- Consumers: `pages/index.vue:10`, `composables/useDownloadResume.ts:14`, `themes/portfolio-dev/pages/projects/Index.vue:10`, `themes/portfolio-dev/pages/resumeObject/{AboutMe,Educations,Experiences,Hero,Languages,Skills}.vue`
- Config: `nuxt.config.ts` `pinia.storesDirs: ['./stores/**']`

## Blockers
none (`/api/resume` needs `MY_EMAIL`/`NODE_API` — present in `.env` for browser check, verified at check time).
