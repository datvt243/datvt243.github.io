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

		if (data) {
			data.generalInformation = ((generalInformation: GeneralInformation[]) => {
				if (!generalInformation.length) return {}
				return generalInformation[0]
			})(data?.generalInformation || [])
		}

		return {
			success,
			resume: data,
		}
	},
	{
		name: 'api-resume',
		getKey() {
			const { myEmail } = useAppConfig()
			return `api-resume-${myEmail}`
		},
		maxAge: 60 * 60 * 24 * 12,
	},
)
