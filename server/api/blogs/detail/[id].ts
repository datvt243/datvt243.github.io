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

    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/${id}`)

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
