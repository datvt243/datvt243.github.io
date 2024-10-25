/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export interface ResumeAPIResponse {
	success: boolean
	message: string
	errors: string[]
	data: Record<string, any>
}
