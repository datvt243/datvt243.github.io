/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import { postResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id)
      return {
        status: false,
        data: null,
        errors: [],
        message: 'Missing ID',
      }

    /**
     * The upstream API only looks posts up by _id and answers 404 for
     * anything else (unknown id, or a slug) - surface that as our own
     * clean 404 instead of an unhandled FetchError.
     */
    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`).catch((e) => {
      if (e?.statusCode === 404) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
      throw e
    })

    const { status, data, errors, message } = parseBlogApiResponse({ schema: postResponseSchema, raw, context: `post detail ${id}` })

    return {
      status,
      data,
      errors,
      message,
    }
  },
  {
    base: 'PostDetail',
    name: 'api-resume',
    getKey(event) {
      const id = getRouterParam(event, 'id')
      return `api-post-${id}`
    },
    maxAge: 60 * 60 * 24 * 12,
  },
)
