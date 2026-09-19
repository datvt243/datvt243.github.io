/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { PaginatedPosts } from '@/types'
import { paginatedPostsResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'

interface Query {
  category?: string
  page?: number
  perPage?: number
}

export const emptyResult = (query: Query): PaginatedPosts => ({
  data: [],
  total: 0,
  page: query.page || 1,
  perPage: query.perPage || 20,
})

export const cacheGetPosts = defineCachedFunction(
  async (query: Query): Promise<PaginatedPosts> => {
    // The blog API (Render free tier) cold-starts in 20-30s after
    // inactivity; Vercel's own serverless function timeout kills the whole
    // request well before 3 retries against that cold start can matter,
    // producing a raw 504 instead of this app's own error handling. A
    // bounded 6s timeout with no retry (retrying just repeats the same
    // slow wait) lets this throw and get caught by the caller, which can
    // still respond within the function's time budget. defineCachedFunction
    // does not cache a rejected call, so a timeout here doesn't poison the
    // cache for the full maxAge - the next request tries again fresh.
    const raw = await $fetch(
      `https://blog-api-nodejs-express.onrender.com/api/v1/post/`,
      {
        query: {
          category: query.category || '',
          page: query.page || 1,
          per_page: query.perPage || 20,
        },
        timeout: 6000,
        retry: 0,
      },
    )

    const { status, data } = parseBlogApiResponse(paginatedPostsResponseSchema, raw, 'posts list')

    if (!status || !data) return emptyResult(query)
    return data
  },
  {
    maxAge: 60 * 60,
    name: 'posts',
    getKey: (query: Query) => {
      const page = query.page || 1
      const perPage = query.perPage || 20
      const category = query.category || ''
      return `posts-${page}-${perPage}-${category}`
    },
  },
)
