/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
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
        container: {
            center: true,
            // padding: '10px',
        },
        extend: {
            fontFamily: { barlow: ['BarlowMedium', defaultTheme.fontFamily.sans] },
            colors: {
                pink: '#ec4899',
                darkness: '#333333',
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
                    '--color-pink': theme('colors.pink'),
                },
            });
        },
    ],
    extend: {},
};
