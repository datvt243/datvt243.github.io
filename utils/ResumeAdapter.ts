import type { Education, Experience, ForeignLanguage, GeneralInformation, Information, Project, ProfessionalSkill, SocialMedia } from '@/types'
import { convertNumberToDate, extractListItems, removeHtmlTags } from '@/utils'

/**
 * Plain mapping functions from raw external-API shapes (`@/types`) to the
 * plain objects the theme renders. Derived labels are computed here, once,
 * so components only read fields.
 */

// The API sends `null` or omits the field when a date isn't set.
const toDate = (ms: number | null | undefined): Date | null => (typeof ms === 'number' ? new Date(ms) : null)
const dateLabel = (date: Date | null): string => (date ? convertNumberToDate(date.getTime()) : '--/--')
/** `"MM/YYYY - MM/YYYY"`, or `"MM/YYYY - present"` while ongoing. */
const dateRangeLabel = (start: Date | null, end: Date | null, ongoing: boolean): string => `${dateLabel(start)} - ${ongoing ? 'present' : dateLabel(end)}`

export const toExperience = (raw: Partial<Experience>) => {
  const startDate = toDate(raw.startDate)
  const endDate = toDate(raw.endDate)
  const isCurrent = Boolean(raw.isCurrent)
  const description = raw.description ?? ''
  return {
    id: raw._id ?? '',
    company: raw.company ?? '',
    position: raw.position ?? '',
    startDate,
    endDate,
    isCurrent,
    description,
    skills: raw.skills ?? [],
    isCareerBreak: Boolean(raw.isCareerBreak),
    /** One of the 12 LinkedIn career-break keys (`resume.careerBreakTypes.*` in i18n), or `''`. */
    careerBreakType: raw.careerBreakType ?? '',
    /** `<li>` items extracted from the raw HTML description. */
    descriptionItems: extractListItems(description),
    dateRangeLabel: dateRangeLabel(startDate, endDate, isCurrent),
  }
}

export const toEducation = (raw: Partial<Education>) => {
  const startDate = toDate(raw.startDate)
  const endDate = toDate(raw.endDate)
  const isCurrent = Boolean(raw.isCurrent)
  const description = raw.description ?? ''
  return {
    id: raw._id ?? '',
    school: raw.school ?? '',
    major: raw.major ?? '',
    startDate,
    endDate,
    isCurrent,
    description,
    /** Plain text, HTML tags stripped. */
    descriptionText: removeHtmlTags(description).trim(),
    startDateLabel: dateLabel(startDate),
    endDateLabel: isCurrent ? 'present' : dateLabel(endDate),
  }
}

/**
 * The raw API sometimes omits `group` from the object entirely (not
 * just `undefined`) rather than always including it - normalized here
 * into `'Other'` so consumers never need an `Object.hasOwn` check.
 */
export const toSkill = (raw: Partial<ProfessionalSkill>) => ({
  name: raw.name ?? '',
  yearsOfExperience: raw.exp ?? 0,
  group: raw.group ?? 'Other',
})

export const toLanguage = (raw: Partial<ForeignLanguage>) => ({
  language: raw.language ?? '',
  level: raw.level ?? '',
})

export const toProject = (raw: Partial<Project>) => {
  const name = raw.name ?? ''
  const description = raw.description ?? ''
  const isWorking = Boolean(raw.isWorking)
  const startDate = toDate(raw.startDate)
  const endDate = toDate(raw.endDate)
  return {
    id: raw._id ?? '',
    name,
    description,
    position: raw.position ?? '',
    technology: raw.technology ?? [],
    images: (raw.images ?? []).filter((src): src is string => typeof src === 'string'),
    link: raw.link ?? '',
    isWorking,
    startDate,
    endDate,
    /** URL-friendly slug derived from `name`, e.g. `"my-cool-app"`. */
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    /** Plain text, HTML tags stripped. */
    descriptionText: removeHtmlTags(description).trim(),
    dateRangeLabel: dateRangeLabel(startDate, endDate, isWorking),
  }
}

export const toHero = (information: Partial<Information>, generalInformation: Partial<GeneralInformation>) => {
  const firstName = information.firstName ?? ''
  const lastName = information.lastName ?? ''
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    positionDesired: generalInformation.positionDesired || 'A frontend developer',
    introduction: information.introduction ?? '',
    email: information.email ?? '',
    openToWork: Boolean(generalInformation.openToWork),
  }
}

export const toSocialMedia = (raw: Partial<SocialMedia>) => {
  const urls = { github: raw.github ?? '', linkedin: raw.linkedin ?? '', website: raw.website ?? '' }
  return {
    ...urls,
    /** Non-empty entries as `{ name, url }` pairs, ready to iterate/render. */
    links: Object.entries(urls)
      .filter(([, url]) => url)
      .map(([name, url]) => ({ name, url })),
  }
}

export type ExperienceModel = ReturnType<typeof toExperience>
export type EducationModel = ReturnType<typeof toEducation>
export type SkillModel = ReturnType<typeof toSkill>
export type LanguageModel = ReturnType<typeof toLanguage>
export type ProjectModel = ReturnType<typeof toProject>
export type HeroModel = ReturnType<typeof toHero>
export type SocialMediaModel = ReturnType<typeof toSocialMedia>
