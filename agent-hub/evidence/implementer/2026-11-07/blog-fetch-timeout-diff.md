# 2026-11-07 - blog-fetch-timeout (diff)
- Worker: implementer · Version: 0.1.0
- Node: `blog-fetch-timeout` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: `/todo #416` — "Blog categories/detail fetch has no timeout: raw Vercel 504 when the blog API is cold". Expected: same timeout + controlled error as `/api/blogs/posts`. #431's changes (cache name, "Missing ID" branch) deliberately NOT done.
- Status: sealed_pending_verifier

## Hub bytes before
94014

## Feature doc
`agent-hub/doctrine/features/blog-list.md` (Behavior #3, OQ9) and `agent-hub/doctrine/features/blog-post.md` (Behavior #3, OQ7). Not edited.

## Diff
| File | Why |
|---|---|
| `server/api/blogs/categories.ts` | `timeout: 6000` (same as `cacheGetPost.ts`) + catch → 503 "Unable to load categories", mirroring `posts.ts` |
| `server/api/blogs/detail/[id].ts` | `timeout: 6000` only; the existing `.catch` keeps 404 → 404 and re-throws the rest (blog-post.md Behavior #3) — a timeout ends as a 500 in ~6s |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new PENDING row `blog-fetch-timeout` |

```diff
--- a/server/api/blogs/categories.ts
+++ b/server/api/blogs/categories.ts
-    // No retry: a retried 429 is one more call against the upstream's limit.
-    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`, { retry: 0 })
+    let raw: unknown
+    try {
+      // No retry: a retried 429 is one more call against the upstream's limit. Timeout: see cacheGetPost.ts.
+      raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`, { timeout: 6000, retry: 0 })
+    } catch (cause) {
+      throw createError({ statusCode: 503, statusMessage: 'Unable to load categories', cause })
+    }
--- a/server/api/blogs/detail/[id].ts
+++ b/server/api/blogs/detail/[id].ts
-     * clean 404 instead of an unhandled FetchError.
+     * clean 404 instead of an unhandled FetchError. Timeout: see cacheGetPost.ts.
-    const raw = await $fetch(`.../post/detail/${id}`, { retry: 0 }).catch((e) => {
+    const raw = await $fetch(`.../post/detail/${id}`, { timeout: 6000, retry: 0 }).catch((e) => {
```

## Command
From `doctrine/MEMORY.md`, repo root: `npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`.
Runtime check: `PORT=3916 node --import <scratchpad>/slow-blog.mjs .output/server/index.mjs` — the preload wraps `globalThis.fetch` so any `onrender.com` request hangs 30s (honouring the abort signal) = a simulated cold blog API; then `curl -s -o /dev/null -w "$u %{http_code} %{time_total}s\n"` per URL. Baseline = same run on a build with the two server files stashed.

## Output
Build (final rebuild, exit 0):
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 306ms · modules 613ms · app 544ms · types 348ms · client 2.57s · server 1.61s · nitro 9.00s
◆ ✨ Build complete in 15.0s!
```
Lint (exit 0), full output:
```
> nuxt-app@1.13.0 lint
> eslint .
```
Typecheck (exit 0), full output:
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```
Test (exit 0):
```
 Test Files  10 passed (10)
      Tests  27 passed (27)
```
Baseline (pre-fix build, simulated cold API):
```
/api/blogs/categories 500 30.030226s
/api/blogs/detail/x 500 30.012046s
```
After (fixed build, simulated cold API):
```
/api/blogs/categories 503 6.017349s
/api/blogs/detail/x 500 6.014248s
/api/blogs/posts?page=1 503 6.019405s
/blogs/x 500 6.179925s
/blogs 503 6.033755s
/en/blogs 503 6.016840s
```
Categories body: `"statusCode": 503, "statusMessage": "Unable to load categories"`; detail body: `"statusCode": 500, "statusMessage": "Server Error"`.
Real upstream (no simulation) — it was genuinely down at the time:
```
upstream warmup 000 60.002357s        (curl -m 60 straight to blog-api .../categories)
/api/blogs/categories 503 6.013774s
/api/blogs/detail/does-not-exist 500 6.010679s
```

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) both `$fetch` carry `timeout: 6000, retry: 0` | Diff above: `{ timeout: 6000, retry: 0 }` in both files |
| (2) categories → 503 "Unable to load categories", not cached; detail 404 kept, rest re-thrown | Body `"statusCode": 503, "statusMessage": "Unable to load categories"`; `nitropack/dist/runtime/internal/cache.mjs:58-62` deletes the pending entry and rethrows (not cached); detail `.catch` unchanged except timeout |
| (3) cold API → controlled 5xx within ~6s, not a hang | After: `categories 503 6.017349s`, `detail/x 500 6.014248s`, `/blogs 503 6.033755s`, `/en/blogs 503 6.016840s`, `/blogs/x 500 6.179925s` vs baseline `30.03s`/`30.01s` (Vercel kills that → raw 504) |
| (4) build + lint + typecheck + test clean | `Build complete in 15.0s!`; lint/typecheck exit 0 with no findings; `Tests  27 passed (27)` |
| Matches blog-list.md Behavior #3, blog-post.md Behavior #3 | Categories error now ends in time so the client shows its error text; detail 404 mapping + re-throw unchanged |
| comments per code-comments.md | One `//` sentence extended + one `/** */` sentence extended, both WHY-pointers to the existing timeout rationale in `cacheGetPost.ts`; no issue refs |

## Supersedes
none — `grep -n "#416" haven/diagrams/dev-loop.prime-mermaid.md` finds only this node's row.

## Still open
none

## Noticed, not done
- Warm path (upstream up → categories 200, detail/does-not-exist 404) NOT re-checked: the real blog API didn't answer in 60s during this pass. The code for that path is unchanged apart from the added option.
- A detail timeout ends as a generic 500 "Server Error" rather than posts' 503 — kept that way because blog-post.md Behavior #3 says non-404 upstream errors are re-thrown; mapping them to 503 would change the spec (operator call).
- #431 items (detail cache `name: 'api-resume'`, dead "Missing ID" branch) left for #431.
- Not checked on a real Vercel deployment; the 6s budget assumes Vercel's function limit is >6s (posts already relied on this and returned its 503 live). `/blogs` runs categories + posts in parallel (6.03s total, not 12s).

## Seal gate
none — no commit/push/delete.
