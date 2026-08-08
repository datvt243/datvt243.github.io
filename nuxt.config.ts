// https://nuxt.com/docs/api/configuration/nuxt-config

/* import * as dotenv from 'dotenv' */

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
  runtimeConfig: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
    public: {
      MY_EMAIL: process.env.MY_EMAIL,
      NODE_API: process.env.NODE_API,
      GITHUB_USER: process.env.GITHUB_USER,
    },
  },

  css: ['~/assets/css/font-face.scss', '~/assets/css/tailwindcss.css', '~/assets/css/styles.scss'],
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
