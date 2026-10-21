import type { ResumeAPIResponse } from '@/types'

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
  return res.data
}
