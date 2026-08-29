/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { APIFormatResponse, PaginatedPosts } from '@/types'

interface Query {
  category?: string
  page?: number
  perPage?: number
}

const emptyResult = (query: Query): PaginatedPosts => ({
  data: [],
  total: 0,
  page: query.page || 1,
  perPage: query.perPage || 20,
})

export const cacheGetPosts = defineCachedFunction(
  async (query: Query): Promise<PaginatedPosts> => {
    const { status = false, data = null } = await $fetch<APIFormatResponse<PaginatedPosts>>(
      `https://blog-api-nodejs-express.onrender.com/api/v1/post/`,
      {
        query: {
          category: query.category || '',
          page: query.page || 1,
          per_page: query.perPage || 20,
        },
        retry: 3,
        retryDelay: 300,
      },
    )

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
