# 2026-10-26 - blog-isr-fallback (diff)

- Worker: implementer · Version: 0.1.0
- Node: `blog-isr-fallback` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #287, branch `bug/287` off `staging` 1d94fb6
- Status: `sealed_pending_verifier`

## Hub bytes before
77923

## Diff
| File | Why |
|---|---|
| `server/api/blogs/posts.ts` | catch → `throw createError({ statusCode: 503, statusMessage: 'Unable to load posts', cause })` instead of `emptyResult` (import dropped). `/** */` WHY: an empty 200 gets ISR-cached as the real page. |
| `themes/portfolio-dev/pages/blogs/Index.vue` | `useFetch` kept (same options), result held as `postsFetch`; on the server only, awaited and an error → fatal `createError` (5xx). `/** */` WHY. Client behaviour unchanged except the 503 now reaches ListRender's error branch. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output
```
npm run build → "◆ ✨ Build complete in 13.4s!", 1 pre-existing WARN (components-BKndnV3n.js (369:0))
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
```

## Runtime
Prod build on :4143, resume via mock :4199 (ok mode). Blog API failure simulated with a test-only preload `node --import scratchpad/p1/blogfail.mjs` that rejects any `fetch` to `blog-api-nodejs-express` while the flag file `scratchpad/p1/BLOGFAIL` exists (real blog API used when absent).
```
== blog API down (fresh server)
/blogs    503 h1= Đã có lỗi phía máy chủ           | NoData: False | iTerm2: False
/en/blogs 503 h1= Something went wrong on our side | NoData: False | iTerm2: False
/api/blogs/posts → 503 {"statusMessage":"Unable to load posts",...}
/sitemap.xml 200
/rss.xml 200
== blog API up (same server)
/blogs    200 h1= _blog | NoData: False | iTerm2: True
/en/blogs 200 h1= _blog | NoData: False | iTerm2: True
api total 4; sitemap has 4 /blogs/ entries
```
Browser (CDP :9888, incognito, fresh server, flag on): load `/en`, real click on the `/en/blogs` nav link →
`{"h1":"_blog","clientNavDown":{"alert":true,"text":"Couldn't load this content.Try again"},"afterRetryUp":{"alert":false,"items":4}}` (flag removed before clicking retry).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. API down → 503 error page / 503 JSON, no 200 "No data" | "blog API down" block |
| 2. API up → posts | "blog API up" block |
| 3. Client nav → error + retry | browser line |
| 4. sitemap/rss still 200 | 200 / 200 |
| 5. checks + comments | above |

Production ISR behaviour (Vercel keeps last good render on a 5xx revalidation) is the same mechanism already verified live for `/` after v1.5.1 (resume-isr-fallback); not re-verifiable locally.

## Noticed, not done
- Issue's suggestion "hide `_blogs` nav when 0 posts" not done: production has 4 posts (`/api/blogs/posts` 200, 2.5s, total 4 at 2026-10-26); the empty page came from the failure path fixed here. A dynamic nav would cost a blog-API call per page render.
- First request after a deploy while Render is cold → 503 error page (no previous ISR render to fall back to), same known gap as `/`.

## Seal gate
none (no commit/push/PR in this pass).
