/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

import type { H3Event } from 'h3'

const langOf = (event: H3Event): AtsLang => (getQuery(event).lang === 'en' ? 'en' : 'vi')

export default defineCachedEventHandler(
  async (event) => ({
    success: true,
    resume: await fetchResume(langOf(event)),
  }),
  {
    name: 'api-resume',
    getKey(event) {
      const { MY_EMAIL } = useRuntimeConfig().public
      return `api-resume-${MY_EMAIL}-${langOf(event)}`
    },
    maxAge: 60 * 60 * 24 * 12,
  },
)
