/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bank-blue': '#002D72',
        'bank-bg': '#F0F7FF',
      },
    },
  },
  plugins: [],
}
