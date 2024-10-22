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
								layoutTransition: { name: 'transition-opacity', mode: 'out-in' },
								pageTransition: { name: 'transition-opacity', mode: 'out-in' },
				},

				postcss: {
								plugins: {
												tailwindcss: {},
												autoprefixer: {},
								},
				},
				runtimeConfig: {},

				css: ['~/assets/css/font-face.scss', '~/assets/css/tailwindcss.css', '~/assets/css/styles.scss'],
				modules: ['@nuxt/image', '@pinia/nuxt', '@nuxt/ui', '@nuxt/icon'],
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

				$development: {
								nitro: {
												storage: {
																PostDetail: { driver: 'fs', base: '/cache' },
												},
								},
				},
})