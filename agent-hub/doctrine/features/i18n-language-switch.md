# Language switch (vi / en)

- Status: draft
- Source: backfill from code
- Issues: -
- Anchors: `nuxt.config.ts`, `i18n/locales/vi.json`, `i18n/locales/en.json`, `themes/portfolio-dev/layout/Header.vue`, `app.vue`, `composables/useResumeData.ts`, `server/utils/siteUrl.ts`

## Goal
Visitors read the site's interface (and the resume's localized text) in
Vietnamese or English.

## Behavior
1. Two locales: `vi` (default, `vi-VN`) and `en` (`en-US`), strategy
   `prefix_except_default`: Vietnamese URLs have no prefix, English URLs are
   under `/en/*`.
2. Browser-language detection is off: `/` never redirects to `/en`
   automatically.
3. The header shows the current locale code (`vi`/`en`); clicking switches to
   the other locale (same page, other prefix). Its aria-label reads
   "<LOCALE>, switch language" (localized).
4. UI chrome strings come from `i18n/locales/<locale>.json`. Nav tab labels
   (`_resume`, `_projects`, …) and code-metaphor labels are deliberately not
   translated.
5. Resume text is fetched with `?lang=<locale>` (see `resume-home.md`); the
   owner's name keeps `lang="vi"`. The PDF follows the locale too.
6. `<html lang>` matches the active locale, and canonical + `hreflang`
   alternate links are generated from `SITE_URL` (`useLocaleHead({ seo: true })`).
7. In `en`, the contact address is shown without diacritics.

## Acceptance criteria
- `curl -s <host>/en | grep -o '<html[^>]*lang="en[^"]*"'` matches; `/`
  gives `lang="vi…"`.
- `curl -s <host>/ | grep -o 'hreflang' | wc -l` ≥ 2 (the HTML is one line,
  so `grep -c` would print 1).
- Requesting `/` with `Accept-Language: en` returns the Vietnamese page
  (no redirect): `curl -s -o /dev/null -w '%{http_code}' -H 'Accept-Language: en' <host>/`
  prints `200`.
- Clicking the locale button on `/github` lands on `/en/github`.

## Edge cases
- Backend has no English text → backend falls back to `vi`.
- Blog posts are not localized; they show the same content under `/en/blogs`.

## Out of scope
- Translating blog content or nav tab names; more than two locales.

## Open questions
1. Several links bypass `localePath` (blog category links, "Back to the
   blog", the home sidebar `_contact.ts`), dropping `/en` readers to
   Vietnamese URLs. (Blog post links are relative `blogs/<id>` and do keep
   `/en`: live `/en/blogs` renders `href="/en/blogs/<id>"`.) Should every
   internal link keep the locale?
2. `sitemap.xml` lists only the Vietnamese URLs (no `/en/*`). Intended (see
   `seo-feeds.md`)?
3. Some strings are hardcoded English outside i18n (FilterFolder "Clear
   filters", ListRender "No data"/"loading ...", category aria-label,
   contact mail subject). Translate them, or intentional?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
