# 2026-08-29 — blog-posts-shape-fix (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `blog-posts-shape-fix`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `types/blog.ts` | New shared `PaginatedPosts` interface (`{data: Post[], total, page, perPage}`) — the real shape the blog API returns |
| `server/utils/cacheGetPost.ts` | `cacheGetPosts` now correctly typed `Promise<PaginatedPosts>`; `$fetch` generic fixed to `APIFormatResponse<PaginatedPosts>`; failure branch returns a proper empty `PaginatedPosts` (`emptyResult()`) instead of `[]`; dropped the unused `errors`/`message` destructure (2 pre-existing lint warnings gone as a side effect) |
| `server/api/blogs/posts.ts` | `Post[] \| []` → `PaginatedPosts` typing; variable renamed `posts` → `result` to match what it actually holds now; response shape unchanged (`{status: true, data: result}`) |
| `server/routes/rss.xml.ts` | Removed the `Array.isArray(...)` defensive unwrap + its explanatory comment; `const { data: posts } = await cacheGetPosts(...)` directly; removed now-unused `Post` type import |
| `server/routes/sitemap.xml.ts` | Same as `rss.xml.ts` |
| `themes/portfolio-dev/pages/blogs/Index.vue` | Removed the duplicated local `GetPosts` interface; imports the shared `PaginatedPosts` instead; `useFetch<APIFormatResponse<GetPosts>>` → `useFetch<APIFormatResponse<PaginatedPosts>>` |

```diff
--- a/server/utils/cacheGetPost.ts
+++ b/server/utils/cacheGetPost.ts
@@ -4,7 +4,7 @@
  * Description:
  */

-import type { APIFormatResponse, Post } from '@/types'
+import type { APIFormatResponse, PaginatedPosts } from '@/types'

 interface Query {
   category?: string
@@ -12,25 +12,30 @@ interface Query {
   perPage?: number
 }

+const emptyResult = (query: Query): PaginatedPosts => ({
+  data: [],
+  total: 0,
+  page: query.page || 1,
+  perPage: query.perPage || 20,
+})
+
 export const cacheGetPosts = defineCachedFunction(
-  async (query: Query) => {
-    const {
-      status = false,
-      data = null,
-      errors = [],
-      message = '',
-    } = await $fetch<APIFormatResponse<Post[]>>(`https://blog-api-nodejs-express.onrender.com/api/v1/post/`, {
-      query: {
-        category: query.category || '',
-        page: query.page || 1,
-        per_page: query.perPage || 20,
+  async (query: Query): Promise<PaginatedPosts> => {
+    const { status = false, data = null } = await $fetch<APIFormatResponse<PaginatedPosts>>(
+      `https://blog-api-nodejs-express.onrender.com/api/v1/post/`,
+      {
+        query: {
+          category: query.category || '',
+          page: query.page || 1,
+          per_page: query.perPage || 20,
+        },
+        retry: 3,
+        retryDelay: 300,
       },
-      retry: 3,
-      retryDelay: 300,
-    })
+    )

-    if (!status) return []
-    return !data ? [] : data
+    if (!status || !data) return emptyResult(query)
+    return data
   },

--- a/server/api/blogs/posts.ts
+++ b/server/api/blogs/posts.ts
@@ -4,16 +4,16 @@
  * Description:
  */

-import type { Post } from '@/types'
+import type { PaginatedPosts } from '@/types'
 import { cacheGetPosts } from '~/server/utils/cacheGetPost'

 export default defineEventHandler(async (event) => {
   const query = getQuery(event)

-  const posts: Post[] | [] = await cacheGetPosts(query)
+  const result: PaginatedPosts = await cacheGetPosts(query)

   return {
     status: true,
-    data: posts,
+    data: result,
   }
 })

--- a/server/routes/rss.xml.ts
+++ b/server/routes/rss.xml.ts
@@ -5,7 +5,6 @@
  * post fetch as /api/blogs/posts.
  */

-import type { Post } from '@/types'
 import { cacheGetPosts } from '~/server/utils/cacheGetPost'

 const SITE_URL = 'https://datvt243.github.io'
@@ -20,13 +19,7 @@ function escapeXml(value: string): string {
 }

 export default defineEventHandler(async (event) => {
-  // `cacheGetPosts` is typed as returning `Post[]` but the real blog API
-  // actually wraps it as `{ data: Post[], total, page, perPage }` (same
-  // mismatch `themes/portfolio-dev/pages/blogs/Index.vue` already works
-  // around via `?.data?.data`) - unwrap defensively rather than trust the
-  // declared return type.
-  const rawPosts = await cacheGetPosts({ page: 1, perPage: 20 })
-  const posts: Post[] = Array.isArray(rawPosts) ? rawPosts : (rawPosts as unknown as { data: Post[] })?.data || []
+  const { data: posts } = await cacheGetPosts({ page: 1, perPage: 20 })

 (sitemap.xml.ts: identical pattern, perPage: 100)

--- a/themes/portfolio-dev/pages/blogs/Index.vue
+++ b/themes/portfolio-dev/pages/blogs/Index.vue
@@ -5,7 +5,7 @@
  * Description:
  */

-import type { APIFormatResponse, Post } from '@/types/index'
+import type { APIFormatResponse, PaginatedPosts } from '@/types/index'

 const { t } = useI18n()
 const query = inject<{ category: Ref<string>, page: Ref<number>, perPage: Ref<number> }>('query');
@@ -13,14 +13,8 @@ const category = toRef(query?.category || '')
 const page = toRef(query?.page || 1)
 const perPage = toRef(query?.perPage || 20)

-interface GetPosts {
-	data: Post[],
-	total: number,
-	page: number,
-	perPage: number
-}
 const fetchKey = `blogs-posts:${category.value}:${page.value}:${perPage.value}`
-const { data, status, refresh } = useFetch<APIFormatResponse<GetPosts>>(`/api/blogs/posts`, {
+const { data, status, refresh } = useFetch<APIFormatResponse<PaginatedPosts>>(`/api/blogs/posts`, {

--- a/types/blog.ts
+++ b/types/blog.ts
@@ -17,3 +17,15 @@ export interface Post {
   excerpt: string
   categoryIds?: string[]
 }
+
+export interface PaginatedPosts {
+  data: Post[]
+  total: number
+  page: number
+  perPage: number
+}
```

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Exit code `0`. No `error` lines. Tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

```
nvm use 24 && npm run lint
```
Verbatim tail:
```
✖ 32 problems (0 errors, 32 warnings)
```
**Down from the established `34` baseline** — grepped the full warning list
for any of the 6 touched files (`types/blog.ts`, `server/utils/
cacheGetPost.ts`, `server/api/blogs/posts.ts`, `server/routes/rss.xml.ts`,
`server/routes/sitemap.xml.ts`, `themes/portfolio-dev/pages/blogs/
Index.vue`) → 0 matches. The 2 fewer warnings are exactly
`cacheGetPost.ts`'s previously-unused `errors`/`message` destructure,
removed as part of this fix (real side-effect improvement, not hidden).

## Browser/API verification
Non-visual server-logic change for 5 of 6 files (no CDP required per
doctrine for those), but `blogs/Index.vue` did change too — real
verification done for both:

Started a real preview server: `PORT=3940 node .output/server/index.mjs`.

1. `curl "http://localhost:3940/api/blogs/posts?page=1&perPage=2"` → real
   response, shape UNCHANGED from before this fix:
   `{"status":true,"data":{"data":[...2 real posts...],"total":4,"page":1,"perPage":2}}`
   — confirms the client-facing contract didn't break.
2. `curl http://localhost:3940/rss.xml` → real, well-formed RSS with real
   post titles/links (e.g. "Cài đặt iTerm2, Oh My Zsh, ..."), no defensive
   unwrap needed anymore, still correct.
3. `curl http://localhost:3940/sitemap.xml` → 9 `<loc>` entries (5 static
   routes + 4 real posts, matching the API's real `total: 4`).
4. Chrome CDP (already running on port 9888, reused): `puppeteer-core`
   script, real `page.goto('http://localhost:3940/blogs')`,
   `waitUntil: 'networkidle0'`. Result:
   ```json
   { "postCount": 7, "firstTitleFound": true, "consoleErrors": [] }
   ```
   (`postCount` counts all `<li>` elements on the page, includes non-post
   `<li>`s like the tech-stack list on other sections rendered in the same
   layout — the real check is `firstTitleFound: true`, confirming the real
   post "iTerm2..." title is present in the rendered page, and
   `consoleErrors: []`.)

Cleanup: preview process killed, temp script (`.tmp-i87-check.mjs`)
deleted. `git status --short` confirmed clean of stray files after.

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| `cacheGetPosts` typed `Promise<PaginatedPosts>`, no union | `git diff` above | ✅ |
| `/api/blogs/posts` response shape byte-for-byte unchanged | `curl` result above matches the pre-existing double-nested shape | ✅ |
| `Array.isArray` guards removed from `rss.xml.ts`/`sitemap.xml.ts` | `git diff` above — both guards deleted | ✅ |
| `blogs/Index.vue`'s local `GetPosts` interface gone | `git diff` above — interface deleted, `PaginatedPosts` imported instead | ✅ |
| Build clean | Tail above, exit 0 | ✅ |
| Lint clean, warnings only decreased | `✖ 32 problems (0 errors, 32 warnings)`, down from 34, 0 in touched files | ✅ |
| Real verification of all 3 endpoints + `/blogs` UI | `curl`/CDP results above | ✅ |

## Noticed, not done
- `server/api/blogs/categories.ts` (unrelated endpoint) wasn't touched —
  out of scope for this issue, no shape mismatch reported there.
- The blog API's `/api/v1/post/` response itself is still not validated
  with a runtime schema (e.g. zod) — this fix only corrects the TypeScript
  type to match reality, doesn't add runtime validation. Not requested by
  issue #87.

## Seal gate
None — no commit/push/PR/delete in this pass. `git status` shows only
working-tree changes on `feature/87`.
