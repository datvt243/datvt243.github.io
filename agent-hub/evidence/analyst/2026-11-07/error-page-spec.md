# analyst — error-page — 2026-11-07

## Task (verbatim)
document error-page

## Doc
`agent-hub/doctrine/features/error-page.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `error.vue`
- `layouts/error.vue`
- `app.vue`
- `composables/useResumeData.ts`
- `themes/portfolio-dev/pages/projects/Index.vue`
- `themes/portfolio-dev/pages/github/Index.vue`
- `themes/portfolio-dev/pages/blogs/Index.vue`
- `pages/blogs/[id].vue`

## Re-check vs code
Behavior 1–5 match code. `error.vue` uses `<NuxtLayout name="error">` (no ThemeHeader/Footer — those live in `app.vue`), status code `text-8xl`, `error.png`. 404 → `error.notFoundTitle/Text`, no retry button (`v-if="!isNotFound"`); else `error.serverTitle/Text` + retry = `window.location.reload()`. Home button `clearError({ redirect: localePath('/') })`. Fatal throwers: `useResumeData` (home + projects, status or 502), github 502, blog list server-only status or 503, blog post 404 or upstream status. Commented legacy block still present. No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. `error.vue` keeps a large commented-out legacy block. Remove? → **Answer (operator 2026-11-07):** Change: remove — #427
2. The 404 page has no "Try again" button by design; confirm. → **Answer (operator 2026-11-07):** Change: add it on 404 too — #428
3. The error page has no site header/footer, so the language, theme and
   dev/hr toggles and the keyboard shortcuts are unavailable there. Intended? → **Answer (operator 2026-11-07):** Intended
4. `error.vue` is rendered without `app.vue`, so `useLocaleHead` never runs:
   live `/en/does-not-exist` shows English text but `<html lang="vi">`
   (the static `nuxt.config.ts` fallback). Bug? → **Answer (operator 2026-11-07):** Bug — #418

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/error-page-spec.md` set in doc + INDEX row; Issues: #418, #427, #428. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
