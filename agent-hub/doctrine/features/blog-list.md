# Blog list with categories and pagination

- Status: verified — confirmed by operator 2026-11-07, see `evidence/analyst/2026-11-07/blog-list-spec.md`
- Source: backfill from code
- Issues: #415, #416, #424, #426, #429, #430
- Anchors: `pages/blogs/index.vue`, `layouts/blog.vue`, `themes/portfolio-dev/pages/blogs/Index.vue`, `themes/portfolio-dev/pages/post/Item.vue`, `themes/portfolio-dev/pages/post/Loading.vue`, `themes/portfolio-dev/components/PostCategories.vue`, `components/ListRender.vue`, `server/api/blogs/posts.ts`, `server/api/blogs/categories.ts`, `server/utils/cacheGetPost.ts`, `server/utils/blogSchemas.ts`, `app.config.ts`

## Goal
Readers browse the owner's blog posts, page by page, optionally by category.

## Behavior
1. `/blogs` and `/en/blogs` are ISR-cached 60s. The page is reachable by URL
   but deliberately not in the header nav or `g`-shortcuts (`app.config.ts`
   comment: the blog API sleeps when idle and has old content).
2. The `blog` layout reads `?category`, `?page` (default 1) and `?per-page`
   (default 20) from the URL and re-reads them when the URL changes. The
   sidebar shows categories; the main area shows the list.
3. Categories: `/api/blogs/categories` fetches the blog API's categories (no
   retry), validates the shape, returns `[]` on `status: false`, and caches 12
   days. Each category links to `/blogs?category=<slug>`; the current one is
   highlighted. Fetch error → localized "couldn't load categories".
   No categories → localized "No categories".
4. Posts: `/api/blogs/posts?page&perPage&category` → blog API `post/` with
   `per_page`, 6s timeout, no retry, cached 1h per page/perPage/category.
   Unreachable/timeout → 503 "Unable to load posts" (not cached). A response
   with `status: false` becomes an empty list (`total: 0`).
5. On the server render, a posts error throws a fatal 5xx (so ISR keeps the
   last good page). In the browser, the list shows a localized error box with
   a "Try again" button that refetches.
6. Client re-navigation shows the previously fetched list for the same key
   immediately, then refetches once in the background and replaces it, without
   flashing the loading state.
7. While loading with nothing to show, 3 skeleton cards appear after 500ms.
   An empty successful result shows "No data".
8. Header: `_blog` heading, localized intro, and a "Show:" selector with
   10/20/30/40/50 per page. Below the list a pagination control
   (`total`, `perPage`).
9. Each post card: created date, title linking to the post, tag badges (also
   linking to the post), excerpt cut to the first 50 words + "...", and a
   "Read more…" link.

## Acceptance criteria
- `curl -s -o /dev/null -w '%{http_code}' '<host>/api/blogs/posts?page=1'`
  returns `200` when the blog API is up and `503` when it is unreachable.
- `/blogs?category=<a real slug>` lists only that category's posts and
  highlights the category in the sidebar (fails live today — Open question 8).
- Changing "Show:" to 10 shows at most 10 posts.
- `npm test` passes (`tests/sanitizePostHtml.test.ts` is the only blog test;
  no list test exists).

## Edge cases
- Blog API cold start (>6s) → server render 5xx → last good ISR page; client
  → error box + retry.
- Excerpt shorter than 50 words → shown in full, no "...".
- Excerpt of exactly 50 words → shown in full plus "..." (`arr.length <
  excerptLength` check in `Item.vue`).

## Out of scope
- Search, tag pages, header-nav entry.

## Open questions
1. Pagination and the "Show:" selector change local state only — the URL
   (`?page`, `?per-page`) is not updated, so a page can't be linked and a
   reload returns to page 1. Intended? → **Answer (operator 2026-11-07):** Bug: keep ?page and ?per-page in the URL — #429
2. `fetchKey` in `themes/portfolio-dev/pages/blogs/Index.vue` is computed
   once from the initial values; after paging, the cache key no longer
   matches the shown page. Intended, or should the key be reactive? → **Answer (operator 2026-11-07):** Bug: reactive key — #429
3. Category links (`/blogs?category=`) don't use `localePath`, so on
   `/en/blogs` a category click drops back to the Vietnamese URL. Bug? (Post
   links are relative `blogs/<id>` and resolve to `/en/blogs/<id>` there.) → **Answer (operator 2026-11-07):** Bug — #424
4. On a categories fetch error, both "couldn't load categories" and "No
   categories" show (the `v-else` belongs to the list, not the error). Bug? → **Answer (operator 2026-11-07):** Bug — #430
5. Category link aria-label "View posts tagged <name>" and ListRender's
   "No data" / "loading ..." are hardcoded English. Intended? → **Answer (operator 2026-11-07):** Bug — #426
6. ListRender's 500ms delay is set once at mount, not per loading phase, so
   later loads show skeletons immediately. Intended? → **Answer (operator 2026-11-07):** Bug: per loading phase — #430
7. The layout reads `per-page` but the API uses `perPage` / upstream
   `per_page`. Confirm `?per-page` is the public URL name. → **Answer (operator 2026-11-07):** Intended (keep)
8. Category filtering does not work live (2026-11-06): the upstream ignores
   `category` (`/api/blogs/posts?category=vue|javascript|zzz` all return the
   same 4 posts; every post has `categoryIds: null`), and `/blogs` is ISR
   without `allowQuery` (unlike `/api/resume`), so Vercel serves the cached
   `/blogs` for `/blogs?category=vue` (`x-vercel-cache: STALE`, no category
   highlighted). Fix the routeRule, the upstream, or both? → **Answer (operator 2026-11-07):** Bug — #415
9. `/api/blogs/categories` (and the detail API) `$fetch` has no `timeout`,
   unlike posts (6s). With the blog API cold, live `/blogs`, `/en/blogs` and
   `/api/blogs/categories` returned Vercel's raw `504
   FUNCTION_INVOCATION_TIMEOUT` instead of the controlled 503/5xx. Add a
   timeout? → **Answer (operator 2026-11-07):** Bug — #416

## Changelog
| Date | Change | Why | Node |
|---|---|---|---|
| 2026-11-06 | Backfilled from code | /spec-backfill | - |
| 2026-11-06 | Reviewer corrections (code + live) | `evidence/spec-backfill/2026-11-06/review.md` | - |
| 2026-11-07 | Operator confirmed Behavior + answered all open questions; Status → verified | analyst backfill re-check, see `evidence/analyst/2026-11-07/blog-list-spec.md` | - |
