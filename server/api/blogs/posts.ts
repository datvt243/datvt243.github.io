/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { PaginatedPosts } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  let result: PaginatedPosts
  try {
    result = await cacheGetPosts(query)
  } catch (cause) {
    /**
     * Blog API unreachable/cold-starting (see cacheGetPost.ts's timeout
     * comment). A controlled 503, not an empty list: an empty 200 would be
     * ISR-cached as the real blog page and replace the last good one.
     */
    throw createError({ statusCode: 503, statusMessage: 'Unable to load posts', cause })
  }

  return {
    status: true,
    data: result,
  }
})
