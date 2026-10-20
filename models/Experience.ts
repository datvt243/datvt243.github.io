import { convertNumberToDate, extractListItems } from '@/utils'
import { BaseModel } from './BaseModel'

export class ExperienceModel extends BaseModel {
  id = ''
  company = ''
  position = ''
  startDate: Date | null = null
  endDate: Date | null = null
  isCurrent = false
  description = ''
  skills: string[] = []
  isCareerBreak = false
  /** One of the 12 LinkedIn career-break keys (`resume.careerBreakTypes.*` in i18n), or `''`. */
  careerBreakType = ''

  /** `<li>` items extracted from the raw HTML description. */
  get descriptionItems(): string[] {
    return extractListItems(this.description)
  }

  /** `"MM/YYYY - MM/YYYY"`, or `"MM/YYYY - present"` while ongoing. */
  get dateRangeLabel(): string {
    const start = this.startDate ? convertNumberToDate(this.startDate.getTime()) : '--/--'
    const end = this.isCurrent ? 'present' : this.endDate ? convertNumberToDate(this.endDate.getTime()) : '--/--'
    return `${start} - ${end}`
  }
}
