/**
 * @file The one `api-resume` fetch for `/` and `/projects`. Nuxt 4 shares
 * a key's data across callers and expects one handler per key.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { Resume } from '@/types/resume-document'

export function useResumeData() {
  const store = useResumeStore()
  return useAsyncData<Resume>('api-resume', () => store.fetchData())
}
