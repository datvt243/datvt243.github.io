/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { postResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'
import { sanitizePostHtml } from '~/server/utils/sanitizePostHtml'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    /**
     * The upstream API only looks posts up by _id and answers 404 for
     * anything else (unknown id, or a slug) - surface that as our own
     * clean 404 instead of an unhandled FetchError. Timeout: see cacheGetPost.ts.
     */
    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`, { timeout: 6000, retry: 0 }).catch((e) => {
      if (e?.statusCode === 404) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
      throw e
    })

    const { status, data, errors, message } = parseBlogApiResponse({ schema: postResponseSchema, raw, context: `post detail ${id}` })

    return {
      status,
      data: data && { ...data, content: sanitizePostHtml(data.content) },
      errors,
      message,
    }
  },
  {
    base: 'PostDetail',
    name: 'api-post-detail',
    getKey(event) {
      const id = getRouterParam(event, 'id')
      return `api-post-${id}`
    },
    maxAge: 60 * 60 * 24 * 12,
    // Dev always refetches so backend data edits show up without clearing the cache.
    shouldBypassCache: () => import.meta.dev,
  },
)
