# 2026-08-25 — i18n-page-content (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `i18n-page-content` (NEW)
- Issue: #80 (`feat: i18n per-page content translation (follow-up to #75)`)

## Task
`i18n-foundation` (#75) only translated site-wide chrome (`ThemeHeader`/
`ThemeFooter` + nav). This node covers the explicitly remaining scope from
#80: static prose unique to each page's content, across
`themes/portfolio-dev/pages/{resumeObject,projects,blogs,post,contact,github}/`
plus the 4 top-level `pages/*.vue` files' `useSeoMeta` title/description
(dynamic resume/blog content itself stays untranslated — API doesn't
support multi-locale, already decided in #75).

## Scope decisions (disclosed before writing code)
Translate only genuine natural-language prose meant to be read as
sentences/labels — headings, empty-state messages, CTAs, placeholders,
SEO title/description, a11y `aria-label`/`sr-only` text. Deliberately
**excluded**, matching the precedent `i18n-foundation` already set for nav
labels (filename-style, not prose, not translated):
- `resumeObject/Index.vue`'s section labels (`about-me.md`, `skills.ts`,
  `experiences.pug`, `educations.json`, `languages.json`) — file-name
  metaphor.
- `contact/Index.vue`'s `_name:`/`_email:`/`_message:` field labels, its
  `contacts`/`find-me-also-in` sidebar section labels, and its
  `submit-message` button — all styled as code/file identifiers.
- `resumeObject/Experiences.vue`'s pseudo-Pug tag names (`h3`, `p.company`,
  `ul.skills`...) — code-editor metaphor, not prose.
- `post/RelatedArticles.vue` — confirmed via grep it's dead code, not
  referenced by `Detail.vue` or anywhere else (leftover Flowbite
  boilerplate with fake data) — out of scope, not touched.
- `post/Author.vue`'s hardcoded `"Author Name"`/`"Author Job"` placeholder
  text — pre-existing unfinished/fake feature (hardcoded external avatar
  URL too, not wired to real author data), unrelated to i18n; translating
  fake placeholder text would add no real value. Noted here, not fixed.
- Educations/Languages/Skills `.vue` files under `resumeObject/` — pure
  API-driven JSON/code rendering, no static prose.

## Also in scope (explicitly flagged in the issue body as remaining work)
`nuxt.config.ts`'s `app.head.htmlAttrs.lang` is a static `'vi'` — fixed via
`useLocaleHead()` + `useHead()` in `app.vue` so `<html lang>` matches the
real active locale.

## Extra fix noticed while doing the above
Giscus's own UI language (`data-lang` on the injected script, previously
hardcoded `'vi'`) now follows `locale.value`, with a live
`setConfig({lang})` postMessage on locale switch — same pattern as the
existing dark/light `setConfig({theme})` watcher. Otherwise a real English
reader would still see a Vietnamese comment widget.

## Acceptance criteria
1. New locale keys under `resume`/`projects`/`blogs`/`post`/`contact`/
   `github` namespaces in `i18n/locales/{vi,en}.json`, real Vietnamese
   translations in `vi.json` (not English echoed back).
2. Every listed static string swapped for `useI18n()`'s `t()`, with the 4
   top-level pages' `useSeoMeta` title/description reactive to locale
   (`computed(() => t(...))`, matching `pages/index.vue`'s existing
   pattern).
3. `<html lang>` follows the real active locale.
4. Giscus's own `data-lang` follows the real active locale.
5. `npm run build` + `npm run lint` clean (lint must show 0 NEW
   errors/warnings vs the session baseline).
6. CDP verification: real click-based locale switch works, translated text
   renders correctly in both `vi` (default, unprefixed) and `en` (`/en/*`)
   for every touched page including a real `/blogs/<id>` post detail page,
   0 console errors.

## Files (theme content, one edit each unless noted)
`themes/portfolio-dev/pages/resumeObject/{AboutMe,Hero}.vue`,
`themes/portfolio-dev/pages/projects/Index.vue`,
`themes/portfolio-dev/pages/blogs/Index.vue`,
`themes/portfolio-dev/pages/post/{Item,Detail,Comments}.vue`,
`themes/portfolio-dev/pages/contact/Index.vue`,
`themes/portfolio-dev/pages/github/{GitRepos,GitUser,part/Item}.vue`,
`pages/{projects,contact,github,blogs/index}.vue` (SEO),
`app.vue` (`<html lang>`), `nuxt.config.ts` (i18n `baseUrl`, see diff note
for why), `i18n/locales/{vi,en}.json`.

## Blockers
None — no new env var needed, `GISCUS_*` already set from #81.
