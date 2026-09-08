# 2026-09-06 - blog-api-runtime-validation (diff)

Worker: implementer
Node: `blog-api-runtime-validation`
Task: `/todo #141`

## New file: `server/utils/blogSchemas.ts`

```ts
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Runtime schema validation (zod) for the external blog
 * API's responses. The TS types in `types/blog.ts`/`types/index.ts` are
 * compile-time only and don't catch the external API changing shape
 * silently at runtime (issue #141) — a shape mismatch here now fails
 * loudly with a clear 502 instead of propagating an undefined/wrong-
 * shaped value into the theme layer.
 */

import { z } from 'zod'

// `isPublic` is declared on the `Post` TS type but the real API never
// returns it (confirmed live 2026-09-06: actual posts carry a `status`
// string, e.g. "publish", instead) and nothing in the app reads
// `post.isPublic` (`grep -rn "isPublic"` across themes/stores/pages: 0
// matches) — kept optional here rather than required so real data
// validates instead of 502ing on a field the API was never sending.
export const postSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  isPublic: z.boolean().optional(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string(),
  categoryIds: z.array(z.string()).optional(),
})

// The real shape of the blog API's `data` field for a post list — a page
// of posts plus pagination metadata, NOT a bare `Post[]` (see the trap in
// `agent-hub/doctrine/domains/PROJECT.md`).
export const paginatedPostsSchema = z.object({
  data: z.array(postSchema),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
})

// The existing `APIFormatResponse<string[]>` cast on this endpoint
// (`server/api/blogs/categories.ts`, pre-this-change) was already wrong —
// the real API returns full category objects (confirmed live
// 2026-09-06), and the actual consumer (`themes/portfolio-dev/components/
// PostCategories.vue`'s `Category` interface) already expects objects,
// not bare strings. Schema follows the real shape + the real consumer,
// not the stale cast.
export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
})

export const categoriesSchema = z.array(categorySchema)

// Mirrors the `{ status = false, data = null, errors = [], message = '' }`
// destructuring defaults already used at every fetch site — same
// tolerance for a missing wrapper field, but now enforces the actual
// shape of whichever field IS present.
function apiFormatResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.boolean().optional().default(false),
    message: z.string().optional().default(''),
    errors: z.array(z.string()).optional().default([]),
    data: dataSchema.nullable().optional().default(null),
  })
}

export const paginatedPostsResponseSchema = apiFormatResponseSchema(paginatedPostsSchema)
export const postResponseSchema = apiFormatResponseSchema(postSchema)
export const categoriesResponseSchema = apiFormatResponseSchema(categoriesSchema)

/**
 * Validates a raw blog API response against `schema`; throws a clear 502
 * (same pattern as `server/api/generate-pdf.ts`'s existing
 * `throw createError({ statusCode: 502, ... })` for a failed external
 * call) instead of letting a shape mismatch silently propagate.
 */
export function parseBlogApiResponse<T extends z.ZodTypeAny>(schema: T, raw: unknown, context: string): z.infer<T> {
  const result = schema.safeParse(raw)

  if (!result.success) {
    throw createError({
      statusCode: 502,
      statusMessage: `Blog API response shape mismatch (${context})`,
      data: result.error.issues,
    })
  }

  return result.data
}
```

## Modified files

```diff
diff --git a/package.json b/package.json
index 7c0c321..bfad2f4 100644
--- a/package.json
+++ b/package.json
@@ -29,7 +29,8 @@
         "puppeteer-core": "^23.8.0",
         "tinycolor2": "^1.6.0",
         "vue": "latest",
-        "vue-router": "latest"
+        "vue-router": "latest",
+        "zod": "^3.25.76"
     },
     "devDependencies": {
         "@nuxt/eslint": "^1.17.0",
diff --git a/server/api/blogs/categories.ts b/server/api/blogs/categories.ts
index d7b05a0..ec43495 100644
--- a/server/api/blogs/categories.ts
+++ b/server/api/blogs/categories.ts
@@ -3,16 +3,13 @@
  * Date: `--/--`
  * Description:
  */
-import type { APIFormatResponse } from '~/types'
+import { categoriesResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'
 
 export default defineCachedEventHandler(
   async (event) => {
-    const {
-      status = false,
-      data = null,
-      errors = [],
-      message = '',
-    } = await $fetch<APIFormatResponse<string[]>>(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`)
+    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`)
+
+    const { status, data } = parseBlogApiResponse(categoriesResponseSchema, raw, 'categories')
 
     return status ? data : []
   },
diff --git a/server/api/blogs/detail/[id].ts b/server/api/blogs/detail/[id].ts
index c25f9be..749c0b4 100644
--- a/server/api/blogs/detail/[id].ts
+++ b/server/api/blogs/detail/[id].ts
@@ -4,7 +4,7 @@
  * Description:
  */
 
-import type { APIFormatResponse, Post } from '@/types'
+import { postResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'
 
 export default defineCachedEventHandler(
   async (event) => {
@@ -18,12 +18,9 @@ export default defineCachedEventHandler(
         message: 'Missing ID',
       }
 
-    const {
-      status = false,
-      data = null,
-      errors = [],
-      message = '',
-    } = await $fetch<APIFormatResponse<Post>>(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`)
+    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`)
+
+    const { status, data, errors, message } = parseBlogApiResponse(postResponseSchema, raw, `post detail ${id}`)
 
     return {
       status,
diff --git a/server/utils/cacheGetPost.ts b/server/utils/cacheGetPost.ts
index ee7959a..1867b11 100644
--- a/server/utils/cacheGetPost.ts
+++ b/server/utils/cacheGetPost.ts
@@ -4,7 +4,8 @@
  * Description:
  */
 
-import type { APIFormatResponse, PaginatedPosts } from '@/types'
+import type { PaginatedPosts } from '@/types'
+import { paginatedPostsResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'
 
 interface Query {
   category?: string
@@ -21,7 +22,7 @@ const emptyResult = (query: Query): PaginatedPosts => ({
 
 export const cacheGetPosts = defineCachedFunction(
   async (query: Query): Promise<PaginatedPosts> => {
-    const { status = false, data = null } = await $fetch<APIFormatResponse<PaginatedPosts>>(
+    const raw = await $fetch(
       `https://blog-api-nodejs-express.onrender.com/api/v1/post/`,
       {
         query: {
@@ -34,6 +35,8 @@ export const cacheGetPosts = defineCachedFunction(
       },
     )
 
+    const { status, data } = parseBlogApiResponse(paginatedPostsResponseSchema, raw, 'posts list')
+
     if (!status || !data) return emptyResult(query)
     return data
   },
diff --git a/types/blog.ts b/types/blog.ts
index 5c5ca4e..3af8f6d 100644
--- a/types/blog.ts
+++ b/types/blog.ts
@@ -8,7 +8,11 @@ export interface Post {
   _id: string
   title: string
   slug: string
-  isPublic: boolean
+  // Declared on the type but the real API never actually returns it
+  // (confirmed live 2026-09-06 while adding runtime validation, issue
+  // #141) and nothing in the app reads `post.isPublic` — kept optional
+  // to match reality instead of a field that was never really there.
+  isPublic?: boolean
   content: string
   authorId: string
   createdAt: string
```

## Scope check
`git status --short` at end of this pass:
```
 M agent-hub/evidence/worker-runs.log        (unrelated — #139's blocked-outcome line, written earlier this session)
 M agent-hub/haven/diagrams/dev-loop.prime-mermaid.md
 M package-lock.json
 M package.json
 M server/api/blogs/categories.ts
 M server/api/blogs/detail/[id].ts
 M server/utils/cacheGetPost.ts
 M types/blog.ts
?? agent-hub/evidence/implementer/2026-09-06/blog-api-runtime-validation-{plan,diff}.md
?? agent-hub/evidence/implementer/2026-09-06/light-mode-elevation-contrast-plan.md   (unrelated — #139)
?? server/utils/blogSchemas.ts
```
Everything under this node's scope is exactly the 7 files listed in the plan note's Files table + this diagram row. The `worker-runs.log` line and `light-mode-elevation-contrast-plan.md` note belong to the earlier `#139` pass in this same session, not this node.
