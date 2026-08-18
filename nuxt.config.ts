// https://nuxt.com/docs/api/configuration/nuxt-config

/* import * as dotenv from 'dotenv' */

// The active UI theme. A theme is a folder under `themes/<name>/` providing:
// - `pages/` - one subfolder per route content (resumeObject, github, contact,
//   projects, blogs, post), auto-imported with the `Theme` prefix (e.g.
//   <ThemeGithub>, <ThemePostDetail>) - these are what each `pages/*.vue` file
//   renders.
// - `components/` - reusable chrome shared across pages (Panel, Folder,
//   NavItem, FilterFolder, CodeBlock, CornerFrame, PageHeading, PostCategories),
//   same `Theme` prefix (e.g. <ThemePanel>).
// - `layout/` - site-wide chrome outside the page content (Header, Footer),
//   rendered directly by app.vue, same `Theme` prefix (e.g. <ThemeHeader>).
// - `tokens.css` - the theme's CSS custom properties (see
//   themes/portfolio-dev/tokens.css).
// Swapping UI = add a new themes/<name>/ folder implementing that contract,
// then change this constant.
const ACTIVE_THEME = 'portfolio-dev'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'vi',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
    layoutTransition: { name: 'transition-opacity', mode: 'out-in' },
    pageTransition: { name: 'transition-opacity', mode: 'out-in' },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Silences the "legacy-js-api" deprecation warning Dart Sass
          // prints on every dev/build - opts into sass-embedded's newer API.
          api: 'modern-compiler',
        },
      },
    },
  },
  runtimeConfig: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
    public: {
      MY_EMAIL: process.env.MY_EMAIL,
      NODE_API: process.env.NODE_API,
      GITHUB_USER: process.env.GITHUB_USER,
      GISCUS_CATEGORY: process.env.GISCUS_CATEGORY,
      GISCUS_CATEGORY_ID: process.env.GISCUS_CATEGORY_ID,
      GISCUS_REPO_ID: process.env.GISCUS_REPO_ID,
    },
  },

  css: [`~/themes/${ACTIVE_THEME}/tokens.css`, '~/assets/css/font-face.scss', '~/assets/css/tailwindcss.css', '~/assets/css/styles.scss'],
  // @nuxt/ui auto-installs @nuxtjs/color-mode (forcing classSuffix: ''); these
  // options merge with that. Defaults to dark (existing look) until the user
  // explicitly toggles - see themes/<name>/settings-colors-theme/{dark,light}.css
  // for the `.dark`/`.light` palettes this class selects between.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },
  components: [
    { path: `~/themes/${ACTIVE_THEME}/pages`, prefix: 'Theme' },
    { path: `~/themes/${ACTIVE_THEME}/layout`, prefix: 'Theme' },
    { path: `~/themes/${ACTIVE_THEME}/components`, prefix: 'Theme' },
    '~/components',
  ],
  modules: ['@nuxt/image', '@pinia/nuxt', '@nuxt/ui', '@nuxt/icon', '@nuxt/eslint'],
  typescript: {
    // The integrated dev/build vue-tsc check runs against the root tsconfig
    // only, whose generated `include` pulls in server/**/*.ts but doesn't
    // exclude it - so every server/ file fails with false "Cannot find
    // name 'defineEventHandler'" etc. errors (Nitro's server-only globals
    // aren't in scope there). server/tsconfig.json already type-checks
    // that directory correctly via editor tooling; disable the integrated
    // check rather than have it report 24 false positives every dev start.
    typeCheck: false,
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },

  routeRules: {
    '/': { isr: 60 },
    '/github': { isr: 60 },
    '/contact': { prerender: true },
    '/blogs': { isr: 60 },
    '/blogs/**': { isr: true },
  },

  $development: {
    nitro: {
      storage: {
        PostDetail: { driver: 'fs', base: '/cache' },
      },
    },
  },
})
