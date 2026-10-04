/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
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
