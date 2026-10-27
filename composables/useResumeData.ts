/**
 * @file The one `api-resume` fetch for `/` and `/projects`. Nuxt 4 shares
 * a key's data across callers and expects one handler per key.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { Resume } from '@/types/resume-document'

/**
 * Throws instead of handing back `error`: a failed load must end as a 5xx,
 * otherwise ISR caches the broken page as a successful 200 and stops serving
 * the last good one.
 */
export async function useResumeData() {
  const store = useResumeStore()
  const { locale } = useNuxtApp().$i18n
  // Keyed per locale so switching language refetches instead of reusing the other one's text.
  const result = await useAsyncData<Resume>(() => `api-resume-${locale.value}`, () => store.fetchData(locale.value))
  if (result.error.value) {
    throw createError({ statusCode: result.error.value.statusCode || 502, statusMessage: 'Unable to load resume data', fatal: true })
  }
  return result
}
