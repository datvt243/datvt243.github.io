# analyst — resume-home — 2026-11-07

## Task (verbatim)
document resume-home

## Doc
`agent-hub/doctrine/features/resume-home.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `pages/index.vue`
- `composables/useResumeData.ts`
- `stores/resume.ts`
- `server/api/resume.ts`
- `server/utils/fetchResume.ts`
- `nuxt.config.ts` (routeRules)
- `themes/portfolio-dev/pages/resumeObject/Index.vue`
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue`
- `themes/portfolio-dev/pages/resumeObject/Skills.vue`
- `themes/portfolio-dev/pages/resumeObject/Educations.vue`
- `themes/portfolio-dev/pages/resumeObject/Languages.vue`
- `utils/ResumeAdapter.ts` (careerBreakType)

## Re-check vs code
Behavior 1–12 match code. `/`,`/en` `isr: 60`; `/api/resume` ISR 60s `allowQuery: [lang]`; handler `maxAge` 12 days, key per email+lang, dev bypass. `useAsyncData` key `api-resume-<locale>`. `fetchResume`: 8s timeout, `retry: 0`, whitelists match the doc, 502 on throw / `success: false`. `useResumeData` throws fatal (status or 502). Hero: avatar `hidden sm:block`, name `:lang="resumeContentLang"`, openToWork badge, `localePath('/contact')` shortcut `c`, download `D`, intro keeps only strong/b, no `v-html`. 4 tabs in order with `data-shortcut` 1–4; `_contact.ts` `to="/contact"`. `?tab` via `router.replace`, default removes it, `onMounted` deep link + watch; reduced-motion → `auto` scroll. Experiences sorted `b.startDate - a.startDate`; 48rem media query. SEO: `titleTemplate: '%s'`, fallback "Võ Tấn CV", OG 1200×630, Person JSON-LD. No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. `pages/index.vue` renders an empty page (no message) when the API returns
   200 with an empty `resume` object (`isValid` false). Intended, or should it
   be an error/empty state? → **Answer (operator 2026-11-07):** Bug: show an empty/error state — #419
2. `certificates`, `awards` and `career` are whitelisted and sent to the
   browser but not shown on the page (the PDF uses certificates/awards).
   Intended? → **Answer (operator 2026-11-07):** Change: show them on the page, a section with no data is hidden — #420
3. `/api/resume` on Vercel ISR allows only the `lang` query (60s); the
   handler itself caches 12 days. Is the 12-day server cache the intended
   max staleness after a backend edit? → **Answer (operator 2026-11-07):** Change: shorten to ~1h — #421 (#379 only fixed the browser cache)
4. The sidebar `_contact.ts` link in `themes/portfolio-dev/pages/resumeObject/Index.vue`
   is `to="/contact"` (no `localePath`); live `/en` renders `href="/contact"`,
   dropping English readers to the Vietnamese page (the hero "Contact me" uses
   `localePath`). Bug? → **Answer (operator 2026-11-07):** Bug — #417

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/resume-home-spec.md` set in doc + INDEX row; Issues: #417, #419, #420, #421. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
