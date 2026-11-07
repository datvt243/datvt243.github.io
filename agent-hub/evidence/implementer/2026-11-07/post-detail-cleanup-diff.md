# 2026-11-07 - post-detail-cleanup (diff)
- Worker: implementer · Version: 0.1.0
- Node: `post-detail-cleanup` (`haven/diagrams/dev-loop.prime-mermaid.md`, new row — no existing row for #431 in the active diagram; slug not in the archive)
- Task: `/todo #431` — "Blog post: real `<time datetime>`, rename the detail cache, drop the dead "Missing ID" branch". Expected: `datetime` = the post's `createdAt` (ISO); cache name `api-post-detail`; dead branch removed.
- Branch: `bug/431` (off staging, includes #416's timeout). Not committed/pushed.
- Status: sealed_pending_verifier

## Hub bytes before
94010

## Feature doc
`agent-hub/doctrine/features/blog-post.md` (verified). OQ1/OQ3/OQ4 already record the operator's answers for #431 (use createdAt / rename / remove). `## Behavior` describes neither the hard-coded datetime nor the "Missing ID" branch (Behavior #1 already says an empty id fails route validation; #6 says "created date") → nothing in the spec contradicts or describes the removed code → doc not edited.

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/post/Detail.vue` | `<time datetime="2023-08-05T00:00:00.000Z">` → `<time :datetime="modelValue.createdAt">` (raw API value, already ISO; `formatDate` stays for the visible text only) |
| `server/api/blogs/detail/[id].ts` | removed the `if (!id) return { status: false, ... 'Missing ID' }` branch; cache `name: 'api-resume'` → `'api-post-detail'` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new IN_PROGRESS row `post-detail-cleanup` |

```diff
--- a/server/api/blogs/detail/[id].ts
+++ b/server/api/blogs/detail/[id].ts
@@ -10,14 +10,6 @@ export default defineCachedEventHandler(
   async (event) => {
     const id = getRouterParam(event, 'id')
 
-    if (!id)
-      return {
-        status: false,
-        data: null,
-        errors: [],
-        message: 'Missing ID',
-      }
-
@@ -39,7 +31,7 @@ export default defineCachedEventHandler(
     base: 'PostDetail',
-    name: 'api-resume',
+    name: 'api-post-detail',
--- a/themes/portfolio-dev/pages/post/Detail.vue
+++ b/themes/portfolio-dev/pages/post/Detail.vue
-                <time datetime="2023-08-05T00:00:00.000Z">
+                <time :datetime="modelValue.createdAt">
```

Typecheck note: `getRouterParam` returns `string | undefined`; `id` is only interpolated into the fetch URL template and the `context` string, so dropping the guard needs no type handling (typecheck clean below).

## Command
From `doctrine/MEMORY.md`, repo root:
- `npm run build`
- `npm run lint`
- `npx nuxi typecheck`
- `npm test`
- Runtime: `PORT=3931 node .output/server/index.mjs` + `curl` (real upstream blog API; post id taken from `GET https://blog-api-nodejs-express.onrender.com/api/v1/post/?page=1&per_page=1` → `67123bdf9c6e9bcf4f7bf006 2024-10-18T10:43:43.254Z`)

## Output
`npm run build` — exit 0, tail:
```
Σ Total size: 99.4 MB (81 MB gzip)
[@nuxt/image] ℹ sharp binaries have been included in your build for darwin-arm64. Make sure you deploy to the same architecture.
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 191ms · modules 607ms · app 561ms · types 355ms · client 2.46s · server 1.55s · nitro 8.81s
◆ ✨ Build complete in 14.5s!
```
(only 2 "error" matches in the log, both file names: `error-template.mjs`, `error-DhXKUbjL.mjs`)

`npm run lint` — exit 0, full output:
```
> nuxt-app@1.13.0 lint
> eslint .
```

`npx nuxi typecheck` — exit 0, full output:
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```

`npm test` — exit 0:
```
 Test Files  10 passed (10)
      Tests  27 passed (27)
   Start at  16:57:55
   Duration  217ms (import 39%, transform 34%, tests 17%, worker 9%)
```

Runtime (built server, SSR HTML):
```
$ curl -s localhost:3931/blogs/67123bdf9c6e9bcf4f7bf006 | grep -o '<time[^>]*>[^<]*</time>'
<time datetime="2024-10-18T10:43:43.254Z">18/10/2024</time>
$ curl -s localhost:3931/en/blogs/67123bdf9c6e9bcf4f7bf006 | grep -o '<time[^>]*>[^<]*</time>'
<time datetime="2024-10-18T10:43:43.254Z">18/10/2024</time>
$ curl -s -o /dev/null -w 'detail-404 %{http_code}\n' localhost:3931/api/blogs/detail/does-not-exist
detail-404 404
$ curl -s localhost:3931/api/blogs/detail/67123bdf9c6e9bcf4f7bf006 | head -c 120
{"status":true,"data":{"_id":"67123bdf9c6e9bcf4f7bf006","title":"Cài đặt iTerm2, Oh My Zsh, Zsh-autosuggestions, Zsh
```

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) `<time datetime>` = post's `createdAt` (ISO) | SSR HTML `<time datetime="2024-10-18T10:43:43.254Z">` = upstream `createdAt` `2024-10-18T10:43:43.254Z` for the same id, on `/blogs/<id>` and `/en/blogs/<id>` |
| (2) cache name `api-post-detail` | diff above: `name: 'api-post-detail'` |
| (3) "Missing ID" branch removed | diff above; detail API still 200 for a real id, 404 for an unknown one (blog-post.md Behavior #3 kept) |
| (4) build + lint + typecheck + test clean | build `Build complete`, lint/typecheck exit 0 with no findings, `Tests  27 passed (27)` |
| comments per code-comments.md | no comment added or changed |

## Supersedes
none (no other not-yet-SEALED row cites #431)

## Still open
none

## Noticed, not done
- `themes/portfolio-dev/pages/post/Item.vue:34` — `<time :datetime="formatDate(modelValue.createdAt)">` puts the display format `dd/mm/yyyy` in `datetime`, which is not a valid machine-readable date. Same class of bug, outside #431's scope (list item, not detail) — candidate for a follow-up issue (fix: `:datetime="modelValue.createdAt"`).
- Renaming the cache `name` changes the Nitro storage key prefix (`PostDetail:api-post-detail:...`), so existing `api-resume`-named detail entries are orphaned (not read again) and posts refetch once after deploy — harmless, expected.

## Seal gate
none (no commit/push/delete)
