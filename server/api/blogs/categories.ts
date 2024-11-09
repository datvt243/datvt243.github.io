/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import type { APIFormatResponse } from '~/types'

export default defineCachedEventHandler(
	async (event) => {

		const {
			status = false,
			data = null,
			errors = [],
			message = '',
		} = await $fetch<APIFormatResponse<string[]>>(
			`https://blog-api-nodejs-express.onrender.com/api/v1/categories`,
		)

		return status ? data : []
	},
	{
		// base: 'PostCategories',
		name: 'api-post-categories',
		maxAge: 60 * 60 * 24 * 12,
	},
)
