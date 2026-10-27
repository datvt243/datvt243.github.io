export default defineAppConfig({
  AppHeading: 'Đạt Võ',

  menuPrimary: [
    {
      page: '_resume',
      link: '/',
      key: 'r',
    },
    {
      page: '_projects',
      link: '/projects',
      key: 'p',
    },
    {
      page: '_github',
      link: '/github',
      key: 'h',
    },
    /**
     * No `_blogs` tab: the blog API sleeps when idle (~1 min to wake) and
     * holds 4 posts from 2024, so it stays reachable at /blogs but out of
     * the nav and the `gb` shortcut until it has fresh content.
     */
    {
      page: '_contact',
      link: '/contact',
      key: 'c',
    },
  ],
  /**
   * Language of the resume fields the API does not localize - the owner's
   * name in Hero. Localized text (introduction, descriptions) is fetched in
   * the active locale (`?lang=`), so it inherits the page's `lang` instead.
   */
  resumeContentLang: 'vi',
  contact: {
    phone: '0385262510',
    address: 'Tân Bình, Hồ Chí Minh',
    email: 'votan.it@gmail.com',
    social: {
      github: 'https://github.com/datvt243',
      linkedin: 'https://www.linkedin.com/in/datvt243/',
      website: 'https://resume-nuxt-vert.vercel.app',
    },
    google_map:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31028.537744975543!2d106.63287150003738!3d10.803360191242497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293818af3a73%3A0xcd8d16d1180acc8b!2zVMOibiBCw6xuaCwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1727518723765!5m2!1svi!2s',
  },

  ui: {
    // secondary = the literal orange UPagination's active page has always used
    colors: { secondary: 'orange', neutral: 'gray' },
    container: {
      base: 'w-full mx-auto max-w-(--breakpoint-lg) px-3 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10',
    },
  },
})
