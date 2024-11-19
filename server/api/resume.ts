/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { ResumeAPIResponse, GeneralInformation } from '@/types'

export default defineCachedEventHandler(
	async (event) => {
		const { NODE_API, MY_EMAIL } = useRuntimeConfig().public

		const { success = false, data = {} } = await $fetch<ResumeAPIResponse>(`${NODE_API}/api/me/${MY_EMAIL}`)

		return {
			success,
			resume: data,
		}
	},
	{
		name: 'api-resume',
		getKey() {
			const { MY_EMAIL } = useRuntimeConfig().public
			return `api-resume-${MY_EMAIL}`
		},
		maxAge: 60 * 60 * 24 * 12,
	},
)
