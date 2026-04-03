/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                experr: {
                    50: '#f5f0ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2d1250',
                },
                accent: {
                    cyan: '#00d9ff',
                    lime: '#39ff14',
                    orange: '#ff6b35',
                    pink: '#ff006e',
                    yellow: '#ffbe0b',
                },
                dark: {
                    900: '#0a0a0a',
                    800: '#1a1a2e',
                    700: '#16213e',
                    600: '#0f3460',
                }
            }
        },
    },
    plugins: [],
// plugins
}
