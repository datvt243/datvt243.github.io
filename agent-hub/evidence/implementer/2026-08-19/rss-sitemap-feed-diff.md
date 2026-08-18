# 2026-08-19 — rss-sitemap-feed (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `rss-sitemap-feed`
- Issue: #73, branch `feature/73`

## Diff
| File | Why |
|---|---|
| `server/routes/rss.xml.ts` (new) | Nitro plain route (not `/api`) serving RSS 2.0 XML at `/rss.xml` — 20 most recent posts via `cacheGetPosts`, hand-built XML string (no new dependency), `escapeXml` helper for title/description |
| `server/routes/sitemap.xml.ts` (new) | Nitro plain route serving `sitemap.xml` — 5 static routes (`/`, `/projects`, `/github`, `/blogs`, `/contact`) + one `<url>` per post at `/blogs/<_id>`, up to 100 posts via `cacheGetPosts` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node `rss-sitemap-feed`: PENDING → IN_PROGRESS (will be SEALED by the verifier) |

## Real bug caught during verification (disclosed, not hidden)
The plan assumed `cacheGetPosts` returns `Post[]` (matching its TS
signature). First real `curl` against a built preview server threw:
```
{"url":"/rss.xml","statusCode":500,...,"message":"posts.map is not a function"}
```
Root cause: `server/utils/cacheGetPost.ts`'s `cacheGetPosts` is typed
`Promise<Post[]>` but the real external API
(`https://blog-api-nodejs-express.onrender.com/api/v1/post/`) actually
returns `{status, data: {data: Post[], total, page, perPage}}` — one level
more nested than the type claims. Confirmed by curling the real API
directly (`HTTP 200`, body starts `{"status":true,"data":{"data":[...]}`).
This is a **pre-existing bug**, not something introduced by this change —
it's silently masked today because
`themes/portfolio-dev/pages/blogs/Index.vue` already defensively unwraps
via `data.value?.data?.data`. `server/api/blogs/posts.ts` itself passes the
wrongly-typed value straight through untouched.

Fix applied, scoped to only the 2 new files (did NOT touch
`cacheGetPost.ts`'s type or implementation — out of scope for issue #73,
`SmallestDiff`):
```ts
const rawPosts = await cacheGetPosts({ page: 1, perPage: 20 })
const posts: Post[] = Array.isArray(rawPosts) ? rawPosts : (rawPosts as unknown as { data: Post[] })?.data || []
```
Recommend a follow-up node to fix `cacheGetPosts`'s actual return type at
the source (see "Noticed, not done" below) — not done here since it would
touch `server/api/blogs/posts.ts`'s contract too, beyond this node's
acceptance criteria.

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — ran twice (once before the unwrap fix, once after);
final run clean, verbatim tail:
```
Σ Total size: 27.5 MB (10 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Both new routes appear in the output chunk list: `chunks/routes/rss.xml.mjs`,
`chunks/routes/sitemap.xml.mjs`. Exit code 0, no error string anywhere.

`npm run lint` — verbatim tail, unchanged from session baseline:
```
✖ 34 problems (0 errors, 34 warnings)
```
Neither new file appears in the problem list.

## Runtime verification (no CDP — non-visual XML endpoints)
Started the real built server (`node .output/server/index.mjs`, port
3000) and curled both routes directly:
- `curl -sD - http://localhost:3000/rss.xml` → `HTTP/1.1 200 OK`,
  `Content-Type: application/xml; charset=UTF-8`, valid `<rss>` body with
  real post titles/links/pubDate/description (e.g. `<link>
  https://datvt243.github.io/blogs/67123bdf9c6e9bcf4f7bf006</link>`).
- `curl -sD - http://localhost:3000/sitemap.xml` → `HTTP/1.1 200 OK`,
  same content-type, valid `<urlset>` with all 5 static routes + 4 real
  post `<url>` entries with ISO `<lastmod>`.
Server stopped after verification (no lingering process).

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `server/routes/rss.xml.ts` exists, RSS 2.0, `application/xml`, recent posts | File created; curl output cited above |
| 2 | `server/routes/sitemap.xml.ts` exists, 5 static + per-post `<url>` | File created; curl output cited above |
| 3 | Both routes reachable, verified for real | curl against a real built preview server, not inferred |
| 4 | Build/lint clean | Cited above, including the real 500 caught and fixed |
| 5 | No new npm dependency | `package.json` untouched — confirmed by `git status` showing no diff to it |

## Noticed, not done
- `server/utils/cacheGetPost.ts`'s `cacheGetPosts` return type (`Post[]`)
  doesn't match its real runtime shape (`{data: Post[], total, page,
  perPage}`) — masked today by a defensive unwrap in
  `themes/portfolio-dev/pages/blogs/Index.vue`, and now also in this
  node's 2 new files. Worth a dedicated follow-up node to fix at the
  source (would also let `server/api/blogs/posts.ts` return a correctly
  typed/shaped response) — not done here, out of scope for issue #73.

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
