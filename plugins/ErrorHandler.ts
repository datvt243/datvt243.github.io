/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.hook('vue:error', (error, instance, info) => {
		console.error('VUE:ERROR -----')
	})
})
