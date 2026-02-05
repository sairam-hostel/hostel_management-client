/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector', // Forces manual toggling via class instead of system preference
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
