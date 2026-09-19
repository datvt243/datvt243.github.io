# 2026-09-19 — blog-api-504-resilience (implementer plan)

- Worker: implementer
- Node: `blog-api-504-resilience` (new)
- Task: fix item 2 of the 4 critical items from the `.claude/review.md` audit.

## Acceptance criteria
1. `server/utils/cacheGetPost.ts`'s `$fetch` to the Render-hosted blog API
   (`retry: 3, retryDelay: 300`) doesn't help when the backend cold-starts in
   20-30s — Vercel's own function timeout kills the whole request first,
   producing a raw `504 FUNCTION_INVOCATION_TIMEOUT` on `/blogs` and
   `/sitemap.xml`.
2. Add a bounded timeout well under the platform limit + a graceful
   fallback, so the route itself responds (with degraded/empty data) instead
   of the platform hard-killing it.
3. `defineCachedFunction`'s cache must not get poisoned with an empty result
   for the full `maxAge` (1h) on a transient cold-start failure — the
   fallback has to happen at the call-site (uncached), not inside the cached
   function body.
4. Build clean + lint clean. No CDP needed (server-only error-handling
   change, not a visual change) — verified instead by directly exercising
   both success and simulated-failure paths against a real dev server.

## Env vars
None needed.
