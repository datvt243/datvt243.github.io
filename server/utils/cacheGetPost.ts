/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { APIFormatResponse, Post } from '@/types'

export const cacheGetPosts = defineCachedFunction(
	async () => {
		const {
			status = false,
			data = null,
			errors = [],
			message = '',
		} = await $fetch<APIFormatResponse<Post[]>>(`https://blog-api-nodejs-express.onrender.com/api/v1/post/`)

		if (!status) return []
		return !data ? [] : data
	},
	{
		maxAge: 60 * 60,
		name: 'posts',
		getKey: () => 'posts',
	},
)
