# Error and 404 page

- Status: draft
- Source: backfill from code
- Issues: -
- Anchors: `error.vue`, `layouts/error.vue`, `composables/useResumeData.ts`, `themes/portfolio-dev/pages/github/Index.vue`, `pages/blogs/[id].vue`, `themes/portfolio-dev/pages/blogs/Index.vue`

## Goal
When a page can't be shown, visitors see what happened and how to recover,
and ISR never caches the failure as a good page.

## Behavior
1. Any fatal error renders `error.vue` in the `error` layout instead of `app.vue` (no site header or
   footer), with the status code in large text and an illustration.
2. 404: localized "This page doesn't exist" title and "link may be broken"
   text, and a "Go to the homepage" button.
3. Any other code: localized "Something went wrong on our side" / "data
   source may be waking up" text, a "Try again" button that does a full page
   reload (so the page is server-rendered again), and the homepage button.
4. "Go to the homepage" clears the error and goes to `/` in the current
   locale.
5. Pages that throw fatal errors on data failure: home and projects
   (resume, upstream status or 502), github (502), blog list on the server
   (upstream status or 503), blog post (404 or upstream status).

## Acceptance criteria
- `curl -s -o /dev/null -w '%{http_code}' <host>/does-not-exist` prints
  `404`; `curl -s -H 'Accept: text/html' <host>/does-not-exist` contains
  "Trang này không tồn tại" (without `Accept: text/html` Nuxt answers a
  JSON error body, not the page).
- `/en/does-not-exist` shows the English 404 text; its homepage button goes
  to `/en`.
- With `NODE_API` unreachable, `/` returns a 5xx and shows "Try again".

## Edge cases
- Error during client navigation → same page, "Try again" reloads the URL.

## Out of scope
- Error reporting/monitoring (`plugins/ErrorHandler.ts` only logs Vue
  errors to the console).

## Open questions
1. `error.vue` keeps a large commented-out legacy block. Remove?
2. The 404 page has no "Try again" button by design; confirm.
3. The error page has no site header/footer, so the language, theme and
   dev/hr toggles and the keyboard shortcuts are unavailable there. Intended?
4. `error.vue` is rendered without `app.vue`, so `useLocaleHead` never runs:
   live `/en/does-not-exist` shows English text but `<html lang="vi">`
   (the static `nuxt.config.ts` fallback). Bug?

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
