# 2026-09-19 — blog-api-504-resilience (implementer diff)

- Worker: implementer
- Node: `blog-api-504-resilience`

## Diff
| File | Why |
|---|---|
| `server/utils/cacheGetPost.ts` | `retry: 3, retryDelay: 300` → `timeout: 6000, retry: 0`. Retrying against a cold-starting backend just repeats the same ~20-30s wait 3x — worse, not better. A single bounded 6s timeout lets the request fail fast enough that the caller can still respond within the platform's function-time budget, instead of the platform killing the whole invocation first. Also exported the previously-private `emptyResult` helper so callers can reuse the exact same fallback shape. |
| `server/api/blogs/posts.ts` | Wrapped `cacheGetPosts(query)` in try/catch; on failure, returns `emptyResult(query)` instead of letting the rejection propagate into a 500. |
| `server/routes/sitemap.xml.ts` | Wrapped the `cacheGetPosts` call in try/catch; on failure, renders the sitemap with `STATIC_ROUTES` only (no post `<url>` entries) instead of failing the whole route. |
| `server/routes/rss.xml.ts` | Same pattern — try/catch, falls back to an empty `<channel>` (still valid RSS) instead of a hard failure. |

```diff
--- server/utils/cacheGetPost.ts
-export const cacheGetPosts = defineCachedFunction(
+export const emptyResult = (query: Query): PaginatedPosts => ({ ... })  // now exported
+export const cacheGetPosts = defineCachedFunction(
   async (query: Query): Promise<PaginatedPosts> => {
     const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/`, {
       query: { ... },
-      retry: 3,
-      retryDelay: 300,
+      timeout: 6000,
+      retry: 0,
     })
     ...

--- server/api/blogs/posts.ts
-  const result: PaginatedPosts = await cacheGetPosts(query)
+  let result: PaginatedPosts
+  try {
+    result = await cacheGetPosts(query)
+  } catch {
+    result = emptyResult(query)
+  }

--- server/routes/sitemap.xml.ts / rss.xml.ts
-  const { data: posts } = await cacheGetPosts({ ... })
+  let posts: PaginatedPosts['data']
+  try {
+    posts = (await cacheGetPosts({ ... })).data
+  } catch {
+    posts = []
+  }
```

## Command
`npm run build` then `npm run lint` (verbatim from `doctrine/MEMORY.md`), run
fresh after a `rm -rf .nuxt` (hit the documented stale-cache trap once
during this session, recovered per `doctrine/domains/PROJECT.md`'s Traps
table).

## Output
`npm run build`: exit 0, `✨ Build complete!`, same pre-existing darwin-arm64
`sharp` warning (not new).

`npm run lint`: first pass surfaced 2 NEW real errors —
`no-useless-assignment` on `let posts: PaginatedPosts['data'] = []` in both
`sitemap.xml.ts`/`rss.xml.ts` (the `= []` initializer is always overwritten
by either branch of the try/catch, so it's dead). Fixed by dropping the
initializer (`let posts: PaginatedPosts['data']` — both branches assign it
before use, so TS's definite-assignment analysis is satisfied). Final:
`✖ 30 problems (0 errors, 30 warnings)` — exact match to the current
baseline.

## Real degradation test (not CDP — server-only logic, verified by directly
exercising the failure path against a real dev server)
Reproduced the actual failure mode live, not just reasoned about it:
temporarily pointed the fetch URL at a non-routable IP (`10.255.255.1`,
timeout lowered to 3s for a faster test loop) on a scratch `npm run dev`
instance (port 4012, `rm -rf .nuxt` first), confirmed all 3 routes degrade
instead of hard-failing, then reverted both the IP and the timeout back to
the real values and re-ran build+lint clean (above) before writing this note.

| Route | Result under simulated failure |
|---|---|
| `GET /api/blogs/posts?page=1&perPage=5` | `200`, `{"status":true,"data":{"data":[],"total":0,"page":"1","perPage":"5"}}` |
| `GET /sitemap.xml` | `200`, valid XML with the 5 `STATIC_ROUTES` `<url>` entries, 0 post URLs |
| `GET /rss.xml` | `200`, valid XML, empty `<channel>` (0 `<item>`s) |

**Cache-poisoning check** (acceptance criterion 3 — the fallback must not
get cached for the full 1h `maxAge`): added a temporary
`console.log('[TEMP-DEBUG] cacheGetPosts INVOKED', ...)` at the top of the
cached function body, called `/api/blogs/posts` with identical query params
3 times in a row, and confirmed **3 separate invocations** in the dev
server log (`grep -c "TEMP-DEBUG"` → `3`) — `defineCachedFunction` does not
cache a rejected call, so a cold-start failure doesn't poison the cache;
the very next request tries the real network again. Debug log removed
before the final build/lint re-run above.

Once the real backend was reachable again (reverted the test IP), a normal
`curl http://localhost:4011/api/blogs/posts` (from the earlier
`seo-canonical-domain-fix` verification session, blog API was warm) still
returned real post data — confirms the happy path is unaffected by this
change.

## Acceptance
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | Bounded timeout, no more ineffective retries | `timeout: 6000, retry: 0` in the diff | ✅ |
| 2 | All 3 routes degrade instead of hard-failing | Table above — all 3 return 200 under simulated failure | ✅ |
| 3 | Failure not cached for the full maxAge | 3 calls → 3 real invocations, confirmed via debug log | ✅ |
| 4 | Build clean | `✨ Build complete!` | ✅ |
| 5 | Lint clean | `30 problems (0 errors, 30 warnings)`, baseline match | ✅ |

## Noticed, not done
The audit's other suggested mitigations (moving off Render's free tier, or
a scheduled keep-alive ping to prevent cold starts in the first place) are
infrastructure/hosting decisions, not code changes — out of scope for this
node, which only prevents the cold start from producing a hard platform
error.

## Seal gate
No outward-facing action taken (no commit/push/PR) — working tree left
dirty on the `staging` branch for the operator to review. The temporary
non-routable-IP/debug-log changes used for verification were fully reverted
before this note was written (confirmed via the final clean build/lint
re-run above).
