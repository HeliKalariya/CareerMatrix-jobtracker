/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#F5EDE9',
          800: '#FFFFFF',
          700: '#EEE1DA',
        }
      },
    },
  },
  plugins: [],
}
