/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF3DC',
        'primary-text': '#2B1E1E',
        accent: '#FF6F61',
        'secondary-accent': '#9BA17B',
        'border-color': 'rgba(43, 30, 30, 0.15)',
      },
      fontFamily: {
        serif: ['serif'],
        sans: ['sans-serif'],
      },
    },
  },
  plugins: [],
}