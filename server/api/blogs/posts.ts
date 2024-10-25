/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { Post } from '@/types'
import { cacheGetPosts } from '~/server/utils/cacheGetPost'

export default defineEventHandler(async (event) => {
	const posts: Post[] | [] = await cacheGetPosts()

	return {
		status: true,
		data: posts,
	}
})
