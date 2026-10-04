/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { Resume, GeneralInformation } from './resume-document'

export interface ResumeAPIResponse {
  success: boolean
  message: string
  errors: string[]
  /**
   * The raw API can return generalInformation as an object or an array of
   * one - callers normalize it to a single GeneralInformation object.
   */
  data: Omit<Resume, 'generalInformation'> & {
    generalInformation: GeneralInformation | GeneralInformation[]
  }
}
