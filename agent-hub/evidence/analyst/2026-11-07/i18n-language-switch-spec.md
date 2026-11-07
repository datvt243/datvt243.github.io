# analyst — i18n-language-switch — 2026-11-07

## Task (verbatim)
document i18n-language-switch

## Doc
`agent-hub/doctrine/features/i18n-language-switch.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `nuxt.config.ts` (i18n block)
- `app.vue`
- `themes/portfolio-dev/layout/Header.vue`
- `composables/useResumeData.ts`
- `themes/portfolio-dev/pages/resumeObject/Hero.vue`
- `themes/portfolio-dev/pages/contact/Index.vue`
- `server/routes/sitemap.xml.ts`
- `themes/portfolio-dev/components/FilterFolder.vue`
- `components/ListRender.vue`

## Re-check vs code
Behavior 1–7 match code. Locales vi (vi-VN, default) / en (en-US), `prefix_except_default`, `detectBrowserLanguage: false`. Header button shows `locale`, `setLocale(other)`, aria-label `<LOCALE>, header.switchLanguage`; nav labels `translate="no"`. Resume fetched per locale; name `lang` from `resumeContentLang`; PDF uses `locale`. `app.vue` `useLocaleHead({ seo: true })` sets `htmlAttrs.lang` + links. Contact address `removeVietnameseTones` when `en`. Open-question facts re-seen: sitemap has no `/en`, hard-coded "Clear filters"/"No data"/"loading ...". No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
1. Several links bypass `localePath` (blog category links, "Back to the
   blog", the home sidebar `_contact.ts`), dropping `/en` readers to
   Vietnamese URLs. (Blog post links are relative `blogs/<id>` and do keep
   `/en`: live `/en/blogs` renders `href="/en/blogs/<id>"`.) Should every
   internal link keep the locale? → **Answer (operator 2026-11-07):** Bug: every internal link keeps the locale — #424 (+ #417)
2. `sitemap.xml` lists only the Vietnamese URLs (no `/en/*`). Intended (see
   `seo-feeds.md`)? → **Answer (operator 2026-11-07):** Bug: add /en/* — #425
3. Some strings are hardcoded English outside i18n (FilterFolder "Clear
   filters", ListRender "No data"/"loading ...", category aria-label,
   contact mail subject). Translate them, or intentional? → **Answer (operator 2026-11-07):** Bug: translate — #426

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/i18n-language-switch-spec.md` set in doc + INDEX row; Issues: #417, #424, #425, #426. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (5 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
