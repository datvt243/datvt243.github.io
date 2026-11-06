# analyst — blog-post — 2026-11-07

## Task (verbatim)
document blog-post

## Doc
`agent-hub/doctrine/features/blog-post.md` (existing bulk-backfill draft, re-checked per recipe step 4, not rewritten)

## Sources read
- `agent-hub/haven/workers/analyst/SOUL.md`
- `agent-hub/haven/workers/analyst/recipes/spec_feature.md`
- `agent-hub/doctrine/features/INDEX.md`
- `agent-hub/doctrine/domains/PROJECT.md`
- `agent-hub/doctrine/MEMORY.md`
- `pages/blogs/[id].vue`
- `server/api/blogs/detail/[id].ts`
- `server/utils/sanitizePostHtml.ts`
- `server/utils/blogSchemas.ts`
- `themes/portfolio-dev/pages/post/Detail.vue`
- `themes/portfolio-dev/pages/post/Author.vue`
- `themes/portfolio-dev/pages/post/Comments.vue`
- `nuxt.config.ts` (routeRules, runtimeConfig.public GISCUS_*)
- `i18n/locales/en.json` (post.*)

## Re-check vs code
Behavior 1–8 match code. `/blogs/**`,`/en/blogs/**` `isr: true`; `validate` → `!!route.params.id`. Detail API: `$fetch` by `_id`, `retry: 0`, no timeout, upstream 404 → 404 "Post not found", other errors re-thrown; `base: 'PostDetail'`, `name: 'api-resume'`, key `api-post-<id>`, `maxAge` 12 days; `content` through `sanitizePostHtml` (defaults + `img`,`h1`,`h2`; also keeps `class` on `code`/`pre` — detail not in Behavior 2, not wrong); unreachable `!id` branch returns 200 `status: false` "Missing ID". Page: no data → fatal, 404 when error absent/404 else kept status + "Unable to load post". SEO title/ogTitle/description/ogDescription from post. Detail.vue: `<time datetime="2023-08-05T00:00:00.000Z">` hard-coded, `<h1>` title, Author (`/Avatar.png`, `AppHeading`, github link `target=_blank rel="author noopener"`), `v-html` content, Tags `#tag` lowercase when tags exist, `to="/blogs"` back link (no `localePath`). Comments.vue: `<ClientOnly>`, `post.comments` heading, configured iff `GISCUS_REPO_ID && GISCUS_CATEGORY_ID`, repo `datvt243/datvt243.github.io`, category default `Comments`, `data-mapping=pathname`, reactions 1, input bottom, theme from colorMode, `data-lang` = locale; else `post.giscusNotConfigured`; watches post `setConfig` theme/lang to the iframe. No discrepancy.

## Questions + answers
Operator (2026-11-07): "ok, behavior đúng" (Behavior section confirmed correct).
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

## Result
status: verified — every open question answered + operator confirmed Behavior.
`Status: verified — confirmed by operator 2026-11-07, see evidence/analyst/2026-11-07/blog-post-spec.md` set in doc + INDEX row; Issues: #416, #421, #424, #431, #432. Behavior unchanged (describes code today; changes tracked by the issues).

## Isolation proof
Separate spawned agent (Agent tool), blank context. Received only the
dispatch prompt (3 tasks, operator's "ok, behavior đúng" confirmation, the
operator's answers + issue numbers). No implementer reasoning, no main
session transcript. All Behavior items re-checked by reading code myself.
