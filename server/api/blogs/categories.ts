/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */
import { categoriesResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'

export default defineCachedEventHandler(
  async (event) => {
    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`)

    const { status, data } = parseBlogApiResponse({ schema: categoriesResponseSchema, raw, context: 'categories' })

    return status ? data : []
  },
  {
    name: 'api-post-categories',
    maxAge: 60 * 60 * 24 * 12,
  },
)
