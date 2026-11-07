# 2026-11-07 - blog-fetch-timeout (plan)
- Worker: implementer · Version: 0.1.0
- Node: `blog-fetch-timeout` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row — no existing row for #416; slug not in the archive)
- Task: `/todo #416` — Blog categories/detail fetch has no timeout: raw Vercel 504 when the blog API is cold. Expected: same timeout + controlled error as `/api/blogs/posts`. Do NOT do #431's changes (cache name, "Missing ID" branch).

## Hub bytes before
94014

## Feature doc
`agent-hub/doctrine/features/blog-list.md` (verified, OQ9 → #416) and `agent-hub/doctrine/features/blog-post.md` (verified, OQ7 → #416). Fix restores blog-list Behavior #3 ("Fetch error → couldn't load categories" needs the request to end in time) and keeps blog-post Behavior #3 (404 → 404, others re-thrown). No contradiction → no doc edit.

## Code anchors
- `server/utils/cacheGetPost.ts:43-44` — reference: `timeout: 6000, retry: 0`
- `server/api/blogs/posts.ts:13-22` — reference: catch → `createError({ statusCode: 503, statusMessage: 'Unable to load posts', cause })`
- `server/api/blogs/categories.ts:10` — `$fetch(..., { retry: 0 })`, no timeout
- `server/api/blogs/detail/[id].ts:26` — `$fetch(..., { retry: 0 })`, no timeout
- `node_modules/nitropack/dist/runtime/internal/cache.mjs:58-62` — cached function rethrows and drops the pending entry on error → a timeout is not cached

## Design choice
- Categories: timeout + 503 wrapper exactly like posts (the issue's "same controlled error").
- Detail: timeout only; its existing `.catch` already maps 404 and re-throws the rest (blog-post.md Behavior #3 says "re-thrown" — turning upstream errors into 503 would change that Behavior, so not done).

## Acceptance
See the node row (4 criteria).
