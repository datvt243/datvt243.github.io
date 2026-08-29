/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { PaginatedPosts } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const result: PaginatedPosts = await cacheGetPosts(query)

  return {
    status: true,
    data: result,
  }
})
