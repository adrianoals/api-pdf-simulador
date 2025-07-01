/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/templates/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'unifisa-blue': '#2196F3',
        'unifisa-dark-blue': '#1565C0',
        'unifisa-purple': '#2B176C',
        'unifisa-yellow': '#FFD600',
        'unifisa-light-blue': '#E3F2FD',
        'unifisa-border': '#BBDEFB'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 