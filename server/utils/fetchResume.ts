import type { ResumeAPIResponse } from '@/types'

/**
 * Only what the site and the PDF render. The backend document also holds
 * private fields (salary, birthday, marital status, gender) that would
 * otherwise reach `/api/resume` and every page's SSR payload.
 */
const PUBLIC_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'introduction',
  'socialMedia',
  'generalInformation',
  'experiences',
  'educations',
  'projects',
  'certificates',
  'awards',
]
const PUBLIC_GENERAL_FIELDS = [
  'positionDesired',
  'career',
  'yearsOfExperience',
  'openToWork',
  'professionalSkills',
  'professionalSkillsGroup',
  'personalSkills',
  'foreignLanguages',
]

const pick = <T extends object>(obj: T, keys: string[]): T =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key))) as T

/**
 * Fetches the owner's resume from the backend. Any failure (non-2xx, which
 * `$fetch` throws on, or a 2xx with `success: false`) becomes a controlled
 * 502 - thrown, not returned, so `defineCachedEventHandler` never caches it.
 */
export async function fetchResume(): Promise<ResumeAPIResponse['data']> {
  const { NODE_API, MY_EMAIL } = useRuntimeConfig().public

  let res: ResumeAPIResponse | undefined
  try {
    res = await $fetch<ResumeAPIResponse>(`${NODE_API}/api/me/${MY_EMAIL}`)
  } catch (cause) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data', cause })
  }

  if (!res?.success || !res.data) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })
  }
  const { generalInformation } = res.data
  return pick(
    {
      ...res.data,
      generalInformation: Array.isArray(generalInformation)
        ? generalInformation.map((info) => pick(info, PUBLIC_GENERAL_FIELDS))
        : generalInformation && pick(generalInformation, PUBLIC_GENERAL_FIELDS),
    },
    PUBLIC_FIELDS,
  )
}
