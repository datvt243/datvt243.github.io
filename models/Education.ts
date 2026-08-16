import { convertNumberToDate, removeHtmlTags } from '@/utils'
import { BaseModel } from './BaseModel'

export class EducationModel extends BaseModel {
  id = ''
  school = ''
  major = ''
  startDate: Date | null = null
  endDate: Date | null = null
  isCurrent = false
  description = ''

  /** Plain text, HTML tags stripped. */
  get descriptionText(): string {
    return removeHtmlTags(this.description).trim()
  }

  get startDateLabel(): string {
    return this.startDate ? convertNumberToDate(this.startDate.getTime()) : '--/--'
  }

  get endDateLabel(): string {
    if (this.isCurrent) return 'present'
    return this.endDate ? convertNumberToDate(this.endDate.getTime()) : '--/--'
  }
}
