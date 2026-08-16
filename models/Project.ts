import { convertNumberToDate, removeHtmlTags } from '@/utils'
import { BaseModel } from './BaseModel'

export class ProjectModel extends BaseModel {
  id = ''
  name = ''
  description = ''
  position = ''
  technology: string[] = []
  images: string[] = []
  link = ''
  isWorking = false
  startDate: Date | null = null
  endDate: Date | null = null

  /** URL-friendly slug derived from `name`, e.g. `"my-cool-app"`. */
  get slug(): string {
    return this.name.toLowerCase().replace(/\s+/g, '-')
  }

  /** Plain text, HTML tags stripped. */
  get descriptionText(): string {
    return removeHtmlTags(this.description).trim()
  }

  /** `"MM/YYYY - MM/YYYY"`, or `"MM/YYYY - present"` while `isWorking`. */
  get dateRangeLabel(): string {
    const start = this.startDate ? convertNumberToDate(this.startDate.getTime()) : '--/--'
    const end = this.isWorking ? 'present' : this.endDate ? convertNumberToDate(this.endDate.getTime()) : '--/--'
    return `${start} - ${end}`
  }
}
