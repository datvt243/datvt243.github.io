/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */
import { categoriesResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'

export default defineCachedEventHandler(
  async () => {
    let raw: unknown
    try {
      // No retry: a retried 429 is one more call against the upstream's limit. Timeout: see cacheGetPost.ts.
      raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`, { timeout: 6000, retry: 0 })
    } catch (cause) {
      throw createError({ statusCode: 503, statusMessage: 'Unable to load categories', cause })
    }

    const { status, data } = parseBlogApiResponse({ schema: categoriesResponseSchema, raw, context: 'categories' })

    return status ? data : []
  },
  {
    name: 'api-post-categories',
    maxAge: 60 * 60 * 24 * 12,
    // Dev always refetches so backend data edits show up without clearing the cache.
    shouldBypassCache: () => import.meta.dev,
  },
)
