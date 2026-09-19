/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { PaginatedPosts } from '@/types'
import { cacheGetPosts, emptyResult } from '~/server/utils/cacheGetPost'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  let result: PaginatedPosts
  try {
    result = await cacheGetPosts(query)
  } catch {
    // Blog API unreachable/cold-starting - degrade to an empty page instead
    // of a 500/504 (see cacheGetPost.ts's timeout comment).
    result = emptyResult(query)
  }

  return {
    status: true,
    data: result,
  }
})
