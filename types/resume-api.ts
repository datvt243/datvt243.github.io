/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { Resume, GeneralInformation } from './resume-document'

export interface ResumeAPIResponse {
  success: boolean
  message: string
  /** Error envelope per the backend's API Response & Error Standard. */
  error?: {
    code: string
    message: string
    details?: { field: string; message: string }[]
  }
  /** Pre-standard error list, kept optional while the backend migrates. */
  errors?: string[]
  /**
   * The raw API can return generalInformation as an object or an array of
   * one - callers normalize it to a single GeneralInformation object.
   */
  data: Omit<Resume, 'generalInformation'> & {
    generalInformation: GeneralInformation | GeneralInformation[]
  }
}
