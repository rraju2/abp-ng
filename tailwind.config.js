
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Critical for LeptonX dark mode toggle
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // LeptonX inspired palette extension
                primary: {
                    500: '#5833cc',
                    600: '#4628a3'
                }
            }
        },
    },
    plugins: [],
}
