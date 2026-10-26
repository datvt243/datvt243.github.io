# 2026-10-26 - blog-isr-fallback (plan)

- Worker: implementer · Version: 0.1.0
- Node: `blog-isr-fallback` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #287 "bug: Blog nav leads to an empty page; posts API times out (~6.4s) on every request", branch `bug/287` off freshly pulled `staging` (`1d94fb6`)

## Hub bytes before: 77923

## Facts re-checked (2026-10-26, now)
- Production `/api/blogs/posts` → 200 in 2.5s, `total 4 n 4`; `/en/blogs` SSR HTML contains the posts (x-vercel-cache MISS). The blog API is alive; at audit time it was cold-starting.
- Root cause of the empty page: `server/api/blogs/posts.ts` turns any upstream failure/timeout into `emptyResult` with 200. `/blogs` is `isr: 60`, so a revalidation during a Render cold start caches the empty page as a good 200 and replaces the last good one (same mechanism as resume-isr-fallback, #282).

## Decision
Not hiding the nav: with 4 real posts the page is only empty because of the failure handling, and a dynamic nav would add a blog-API call to every page render. Instead, failure → 5xx so Vercel ISR keeps the last good render; in the browser (client nav) the 503 lands in ListRender's error + retry (#286).

## Plan
1. `server/api/blogs/posts.ts`: catch → `createError(503)` instead of `emptyResult`.
2. `themes/portfolio-dev/pages/blogs/Index.vue`: server-side, await the fetch; error → fatal `createError` (5xx).
`sitemap.xml`/`rss.xml` call `cacheGetPosts` directly with their own try/catch — unchanged.

## Acceptance criteria
1. Blog API down, fresh server: `/blogs`, `/en/blogs` → 503 error page (server-error copy + retry), not a 200 "No data"; `/api/blogs/posts` → 503 JSON.
2. Blog API up: `/blogs` 200 with posts (unchanged).
3. Client nav to blogs with API down → ListRender error + retry, not "No data".
4. `sitemap.xml`, `rss.xml` still 200 with API down.
5. build/lint/typecheck clean; comments per code-comments.md.
