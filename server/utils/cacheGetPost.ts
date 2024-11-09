/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { APIFormatResponse, Post } from '@/types'

interface Query { category?: string, page?: number, perPage?: number }

export const cacheGetPosts = defineCachedFunction(
	async (query: Query) => {

		const {
			status = false,
			data = null,
			errors = [],
			message = '',
		} = await $fetch<APIFormatResponse<Post[]>>(`https://blog-api-nodejs-express.onrender.com/api/v1/post/`, {
			query: {
				category: query.category || '',
				page: query.page || 1,
				'per_page': query.perPage || 20
			},
			retry: 3,
			retryDelay: 300,
		})

		if (!status) return []
		return !data ? [] : data
	},
	{
		maxAge: 60 * 60,
		name: 'posts',
		getKey: (query: Query) => {
			const page = query.page || 1;
			const perPage = query.perPage || 20;
			const category = query.category || '';
			return `posts-${page}-${perPage}-${category}`
		},
	},
)
