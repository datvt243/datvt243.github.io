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
    runtimeConfig: {
        /* MY_EMAIL: process.env.MY_EMAIL,
        API_RESUME: process.env.RESUME_API,
        SERVICE_RESUME: 'api/resume', */
    },

    css: ['~/assets/css/tailwindcss.css'],
    modules: ['@nuxt/image', '@pinia/nuxt'],
    typescript: {
        typeCheck: true,
    },

    nitro: {
        prerender: {
            routes: ['/'],
        },
    },
});
