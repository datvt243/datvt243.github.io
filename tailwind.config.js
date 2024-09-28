/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['selector'],
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
    ],
    theme: {
        container: {
            center: true,
            padding: '10px',
        },
        extend: {
            colors: {
                pink: '#ec4899',
            },
        },
    },
    plugins: [],
};
