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
