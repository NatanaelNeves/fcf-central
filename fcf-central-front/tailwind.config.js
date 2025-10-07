/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fcf-blue': '#2563eb',
        'fcf-blue-light': '#3b82f6',
      }
    },
  },
  plugins: [],
}