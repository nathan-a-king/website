/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4B6F93",
          charcoal: "#262E38",
          ink: "#161D27",
          highlight: "#E3EAF4",
        },
      },
      boxShadow: {
        pill: "0 16px 40px rgba(13, 15, 18, 0.14)",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
}
