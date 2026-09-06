/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import { categoriesResponseSchema, parseBlogApiResponse } from '~/server/utils/blogSchemas'

export default defineCachedEventHandler(
  async (event) => {
    const raw = await $fetch(`https://blog-api-nodejs-express.onrender.com/api/v1/categories`)

    const { status, data } = parseBlogApiResponse(categoriesResponseSchema, raw, 'categories')

    return status ? data : []
  },
  {
    // base: 'PostCategories',
    name: 'api-post-categories',
    maxAge: 60 * 60 * 24 * 12,
  },
)
