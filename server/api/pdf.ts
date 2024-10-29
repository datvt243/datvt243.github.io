/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { ResumeAPIResponse, GeneralInformation } from '@/types'
import { createCV } from '~/utils/createResume'

export default defineEventHandler(
	async (event) => {
		const { NODE_API, MY_EMAIL } = useRuntimeConfig().public

		const { success = false, data } = await $fetch<ResumeAPIResponse>(`${NODE_API}/api/me/${MY_EMAIL}`)

		if (data) {
			data.generalInformation = ((generalInformation: GeneralInformation[]) => {
				if (!generalInformation.length) return {}
				return generalInformation[0]
			})(data?.generalInformation || [])
		}

		const pdf = await createCV(data)

		return pdf
	},
	// {
	// 	name: 'pdf',
	// 	getKey() {
	// 		const { myEmail } = useAppConfig()
	// 		return `pdf-${myEmail}`
	// 	},
	// 	maxAge: 60 * 60 * 24 * 12,
	// },
)
