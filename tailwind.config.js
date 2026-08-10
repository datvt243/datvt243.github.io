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
    scale[`${i * 100}`] = color // '100', '200', ..., '900'
  }
  return scale
}

/**
 * Reads a color from a CSS custom property (defined by the active theme's
 * tokens.css, see themes/<name>/tokens.css) while keeping Tailwind's
 * opacity modifiers (e.g. `bg-theme-panel/50`) working.
 * @param { string } variable e.g. '--theme-panel'
 */
const themeColor = (variable) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  darkMode: ['selector'],
  content: [
    './components/**/*.{js,vue,ts,jsx}',
    './themes/**/*.{js,vue,ts,jsx}',
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
    /* colors: {
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
		}, */
    container: {
      center: true,
      // padding: '10px',
    },
    extend: {
      fontFamily: {
        barlow: ['Barlow', defaultTheme.fontFamily.sans],
        opensans: ['Open Sans', defaultTheme.fontFamily.sans],
        'theme-mono': ['var(--theme-font-mono)'],
      },
      colors: {
        darkness: '#23272d',
        pink: generateColorScale('#ec4899'),
        dark: generateColorScale('#333333'),
        // Semantic tokens for the active UI theme (see themes/<name>/tokens.css).
        // Swapping the value of ACTIVE_THEME in nuxt.config.ts is enough to
        // re-skin every component that uses `theme-*` classes.
        theme: {
          panel: themeColor('--theme-panel'),
          'panel-subtle': themeColor('--theme-panel-subtle'),
          border: themeColor('--theme-border'),
          'border-subtle': themeColor('--theme-border-subtle'),
          'border-faint': themeColor('--theme-border-faint'),
          text: themeColor('--theme-text'),
          'text-strong': themeColor('--theme-text-strong'),
          'text-soft': themeColor('--theme-text-soft'),
          muted: themeColor('--theme-muted'),
          faint: themeColor('--theme-faint'),
          accent: themeColor('--theme-accent'),
          'accent-soft': themeColor('--theme-accent-soft'),
          'accent-contrast': themeColor('--theme-accent-contrast'),
        },
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
          '--color-green': theme('colors.green[500]'),
          '--color-pink': theme('colors.pink[500]'),
        },
      })
    },
  ],
  extend: {},
}
