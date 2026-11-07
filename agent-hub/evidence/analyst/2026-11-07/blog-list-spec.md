# analyst — blog-list — 2026-11-07

## Task (verbatim)
document blog-list

## Doc
`agent-hub/doctrine/features/blog-list.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `pages/blogs/index.vue`
- `layouts/blog.vue`
- `themes/portfolio-dev/pages/blogs/Index.vue`
- `themes/portfolio-dev/pages/post/Item.vue`
- `themes/portfolio-dev/pages/post/Loading.vue`
- `themes/portfolio-dev/components/PostCategories.vue`
- `components/ListRender.vue`
- `server/api/blogs/posts.ts`
- `server/api/blogs/categories.ts`
- `server/utils/cacheGetPost.ts`
- `server/utils/blogSchemas.ts`
- `nuxt.config.ts` (routeRules)
- `app.config.ts` (menuPrimary comment)
- `i18n/locales/en.json,` `i18n/locales/vi.json` (blogs.*, error.*)

## Re-check vs code
Behavior 1–9 match code. `/blogs`,`/en/blogs` `isr: 60` (no `allowQuery`); `app.config.ts` comment explains no `_blogs` tab. `layouts/blog.vue` reads `category`/`page` (1)/`per-page` (20) + `watch(route.query)`, `provide('query')`. Categories: `$fetch` `retry: 0`, no timeout, zod-validated, `status ? data : []`, `maxAge` 12 days; link `/blogs?category=<slug>` (no `localePath`), active highlight, `categoriesLoadError` on `v-if=error`, `v-else` of the list → `noCategories`. Posts: `post/` with `per_page`, `timeout: 6000`, `retry: 0`, `maxAge` 1h, key `posts-<page>-<perPage>-<category>`; catch → 503 "Unable to load posts"; `!status` → `emptyResult`. Server render fatal (status or 503); ListRender error box + `error.retry` ("Try again") emits retry → `refresh()`. `getCachedData` from payload + one guarded `onMounted` refresh; `listStatus` keeps 'success' while data exists. ListRender 500ms `setTimeout` once (immediate watch), 3 skeletons, hard-coded "No data". Header `_blog`, `blogs.intro`, `blogs.show` + USelect 10–50, UPagination `total`/`perPage`. Item: createdAt, title + tag links to relative `blogs/<_id>`, excerpt `arr.length < 50` else 50 words + "...", `blogs.readMore`. `fetchKey` is a plain string built once. No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
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

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/blog-list-spec.md` set in doc + INDEX row; Issues: #415, #416, #424, #426, #429, #430. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (3 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
