/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export * from './resume-api'
export * from './resume-document'
export * from './blog'

export interface APIFormatResponse<T> {
	status: boolean
	message: string
	errors: string[]
	data: T | null
}
