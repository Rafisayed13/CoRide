/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A8E92E',
        lightgreen: '#C6F67E',
        bgsoft: '#F4F8EA',
        textdark: '#1C1C1C',
      },
    },
  },
  plugins: [],
}
