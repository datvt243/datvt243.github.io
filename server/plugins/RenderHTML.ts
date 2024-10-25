/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('render:html', (html, { event }) => {
		html.bodyAttrs.push('class="bg-darkness text-white"')
	})
})
