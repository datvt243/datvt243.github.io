/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import sanitizeHtml from 'sanitize-html'
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

    const { status, data, errors, message } = parseBlogApiResponse(postResponseSchema, raw, `post detail ${id}`)

    // `data.content` is rendered via v-html on the client (rich-text blog
    // content, expected to contain real HTML) - blogSchemas.ts's zod
    // validation only checks shape, not HTML safety, so sanitize here,
    // once, server-side, before this response is cached - defense-in-depth
    // against a compromised/misconfigured first-party blog backend.
    if (data) data.content = sanitizeHtml(data.content)

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
