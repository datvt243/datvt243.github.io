/** @type {import('tailwindcss').Config} */
import tinycolor from 'tinycolor2'

/**
 * Tạo danh sách màu với mã màu gốc - tinycolors
 * @param { string } baseColor
 * @returns colors[]
 */
const generateColorScale = (baseColor) => {
  const scale = {}
  for (let i = 1; i <= 9; i++) {
    const ratio = (i - 5) * 10
    const color = tinycolor(baseColor).lighten(ratio).toHexString()
    scale[`${i * 100}`] = color
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
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        'theme-mono': ['var(--theme-font-mono)'],
      },
      colors: {
        darkness: '#23272d',
        pink: generateColorScale('#ec4899'),
        dark: generateColorScale('#333333'),
        /**
         * Semantic tokens for the active UI theme (see themes/<name>/tokens.css).
         * Swapping the value of ACTIVE_THEME in nuxt.config.ts is enough to
         * re-skin every component that uses `theme-*` classes.
         */
        theme: {
          canvas: themeColor('--theme-canvas'),
          panel: themeColor('--theme-panel'),
          'panel-subtle': themeColor('--theme-panel-subtle'),
          editor: themeColor('--theme-editor'),
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
          'code-text': themeColor('--theme-code-text'),
          'code-line-number': themeColor('--theme-code-line-number'),
          'code-keyword': themeColor('--theme-code-keyword'),
          'code-key': themeColor('--theme-code-key'),
          'code-type': themeColor('--theme-code-type'),
          'code-string': themeColor('--theme-code-string'),
          'code-punct': themeColor('--theme-code-punct'),
          'code-comment': themeColor('--theme-code-comment'),
          'code-tag': themeColor('--theme-code-tag'),
          'code-title': themeColor('--theme-code-title'),
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
