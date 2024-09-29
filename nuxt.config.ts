// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        },
    },

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {},

    css: ['~/assets/css/tailwindcss.css'],
    modules: ['@nuxt/image', '@pinia/nuxt', 'nuxt-feather-icons'],
    typescript: {
        typeCheck: true,
    },
    pinia: {
        storesDirs: ['./stores/**'],
    },

    routeRules: {
        '/': { prerender: true },
        '/contact': { prerender: true },
        '/blogs': { isr: 60 },
        '/blogs/**': { isr: true },

        /* '/static': {
            static: true,
        },
        '/ssr': {
            ssr: true,
        },
        '/ssr-false': {
            ssr: false,
        },

        '/swr': {
            swr: true,
        },
        '/swr-3000': {
            swr: 10,
        },
        '/isr': {
            isr: true,
        },
        '/isr-3000': {
            isr: 10,
        }, */
    },
});
