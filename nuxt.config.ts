// https://nuxt.com/docs/api/configuration/nuxt-config

/* import * as dotenv from 'dotenv' */

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
	runtimeConfig: {
		public: {
			MY_EMAIL: process.env.MY_EMAIL,
			NODE_API: process.env.NODE_API,
			GITHUB_TOKEN: process.env.GITHUB_TOKEN,
			GITHUB_USER: process.env.GITHUB_USER,
		},
	},

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
		'/github': { prerender: true },
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
