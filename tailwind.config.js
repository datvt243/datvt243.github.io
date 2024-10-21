/** @type {import('tailwindcss').Config} */
import tinycolor from 'tinycolor2'
import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * Tạo danh sách màu với mã màu gốc - tinycolors
 * @param { string } baseColor
 * @returns colors[]
 */
const generateColorScale = (baseColor) => {
	const scale = {}
	// Các mức độ màu từ 100 đến 900 (thêm sáng hoặc tối)
	for (let i = 1; i <= 9; i++) {
		const ratio = (i - 5) * 10 // Điều chỉnh độ sáng/tối
		const color = tinycolor(baseColor).lighten(ratio).toHexString()
		scale[`${i * 100}`] = color // Ví dụ: '100', '200', ..., '900'
	}
	return scale
}

export default {
	darkMode: ['selector'],
	content: [
		'./components/**/*.{js,vue,ts,jsx}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
		'./server/plugins/*.{js,ts}',
	],
	theme: {
		fontFamily: {
			barlow: ['BarlowMedium', defaultTheme.fontFamily.sans],
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: '#ffffff',
			darkness: '#23272d',
			red: generateColorScale('#fe3d57'),
			pink: generateColorScale('#ec4899'),
			green: generateColorScale('#42b883'),
			blue: generateColorScale('#38b2ac'),
			sky: generateColorScale('#61dafb'),
			violet: generateColorScale('#18315a'),
			dark: generateColorScale('#333333'),
			orange: generateColorScale('#C66828'),
		},
		container: {
			center: true,
			// padding: '10px',
		},
		extend: {
			fontFamily: {
				barlow: ['Barlow', defaultTheme.fontFamily.sans],
				jetbrains: ['JetBrains Mono', defaultTheme.fontFamily.sans],
				opensans: ['Open Sans', defaultTheme.fontFamily.sans],
			},
			colors: {
				// pink: generateColorScale('#ec4899'),
				// darkness: generateColorScale('#333333',
			},
			container: {
				block: {},
			},
		},
	},
	plugins: [
		function ({ addBase, theme }) {
			addBase({
				':root': {
					'--color-pink': theme('colors.pink[500]'),
				},
			})
		},
	],
	extend: {},
}
