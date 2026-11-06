# Blog post detail with comments

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/blog-post-spec.md`
- Source: backfill from code
- Issues: #416, #421, #424, #431, #432
- Anchors: `pages/blogs/[id].vue`, `server/api/blogs/detail/[id].ts`, `server/utils/sanitizePostHtml.ts`, `server/utils/blogSchemas.ts`, `themes/portfolio-dev/pages/post/Detail.vue`, `themes/portfolio-dev/pages/post/Author.vue`, `themes/portfolio-dev/pages/post/Comments.vue`, `nuxt.config.ts`

## Goal
Readers read one full post, see who wrote it, and can comment via GitHub
Discussions (Giscus).

## Behavior
1. `/blogs/<id>` and `/en/blogs/<id>` are ISR-cached (`isr: true`). An empty
   `id` fails route validation.
2. `/api/blogs/detail/<id>` fetches the blog API by `_id` (no retry), caches
   12 days per id in the `PostDetail` storage, and returns the post with
   `content` passed through `sanitizePostHtml` (sanitize-html defaults plus
   `img`, `h1`, `h2`).
3. Upstream 404 (unknown id or a slug) → API 404 "Post not found". Other
   upstream errors are re-thrown.
4. The page throws a fatal 404 "Post not found" when there is no post data
   and the error is a 404 or absent; any other error status is kept with
   "Unable to load post" (so an outage isn't shown as "not found").
5. SEO title/OG title = post title, description = excerpt.
6. Layout: created date, title (`<h1>`), an author card (avatar, `AppHeading`
   linking to the GitHub profile, `rel="author noopener"`, new tab), the
   sanitized HTML content, a Tags block (`#tag`, lowercase) when tags exist,
   and a "Back to the blog" button linking to `/blogs`.
7. Comments (client-only): a "Comments" heading. When `GISCUS_REPO_ID` and
   `GISCUS_CATEGORY_ID` are set, the Giscus script loads with repo
   `datvt243/datvt243.github.io`, category `GISCUS_CATEGORY` (default
   `Comments`), mapping `pathname`, reactions on, input at bottom, theme
   `dark`/`light` from the color mode, and `lang` = current locale. Without
   them, a localized "Giscus is not configured yet." placeholder.
8. Toggling color mode or language updates the Giscus iframe's theme/lang via
   `postMessage` without reloading it.

## Acceptance criteria
- `npm test` passes, including `tests/sanitizePostHtml.test.ts`.
- `curl -s -o /dev/null -w '%{http_code}' <host>/api/blogs/detail/does-not-exist`
  returns `404`; `/blogs/does-not-exist` renders the 404 error page.
- A post whose content contains `<script>` renders without it (sanitized).
- With `GISCUS_REPO_ID`/`GISCUS_CATEGORY_ID` unset, the post page shows
  "Giscus is not configured yet." under "Comments". (Production has them
  set: the live payload carries `GISCUS_CATEGORY:"Announcements"` and both
  IDs, so live shows the Giscus widget.)
- With Giscus configured, toggling the color mode changes the Giscus theme
  without a page reload.

## Edge cases
- Blog API down → error page with the upstream status, not 404.
- Post without tags → no Tags block.

## Out of scope
- Slug URLs (links only use `_id`), editing posts, comment moderation.

## Open questions
1. `Detail.vue` hardcodes `<time datetime="2023-08-05T00:00:00.000Z">` for
   every post instead of the post's `createdAt`. Bug? → **Answer (operator 2026-11-07):** Bug: use createdAt — #431
2. "Back to the blog" links to `/blogs` without `localePath`, so `/en` readers
   go back to the Vietnamese list. Bug? → **Answer (operator 2026-11-07):** Bug — #424
3. The detail cache uses `name: 'api-resume'` (same name as the resume
   handler; keys differ: `api-post-<id>`). Copy-paste leftover — rename? → **Answer (operator 2026-11-07):** Change: rename — #431
4. The "Missing ID" branch in the detail API returns a 200 with
   `status: false`; route validation makes it unreachable from the page.
   Keep or remove? → **Answer (operator 2026-11-07):** Change: remove — #431
5. Giscus `mapping: pathname` means `/blogs/<id>` and `/en/blogs/<id>` get
   two separate discussion threads. Intended? → **Answer (operator 2026-11-07):** Change: one thread per post id — #432
6. A post content edit can take up to 12 days to show (detail cache maxAge).
   Intended? → **Answer (operator 2026-11-07):** Change: ~1h — #421
7. The detail API's upstream `$fetch` has no `timeout`; with the blog API
   cold, live `/blogs/does-not-exist` and `/api/blogs/detail/does-not-exist`
   returned Vercel's raw `504 FUNCTION_INVOCATION_TIMEOUT` (404 once warm).
   Add a bounded timeout like the posts list (6s)? → **Answer (operator 2026-11-07):** Bug — #416

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/blog-post-spec.md` | - |
