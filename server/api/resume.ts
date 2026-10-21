/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

export default defineCachedEventHandler(
  async () => ({
    success: true,
    resume: await fetchResume(),
  }),
  {
    name: 'api-resume',
    getKey() {
      const { MY_EMAIL } = useRuntimeConfig().public
      return `api-resume-${MY_EMAIL}`
    },
    maxAge: 60 * 60 * 24 * 12,
  },
)
