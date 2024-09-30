/** @type {import('tailwindcss').Config} */
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
        container: {
            center: true,
            // padding: '10px',
        },
        extend: {
            colors: {
                pink: '#ec4899',
                darkness: '#333333',
            },
            container: {
                block: {},
            },
        },
    },
    plugins: [],
    extend: {},
};
