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
          accent: "#5A8AB4",
          soft: "#F5F8FB",
        },
      },
      boxShadow: {
        pill: "0 16px 40px rgba(13, 15, 18, 0.14)",
        'soft': '0 2px 8px rgba(75, 111, 147, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 30px rgba(75, 111, 147, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 20px 50px rgba(75, 111, 147, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
        'primary': '0 4px 14px rgba(75, 111, 147, 0.25)',
        'primary-lg': '0 8px 24px rgba(75, 111, 147, 0.3)',
        'inner-soft': 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(75, 111, 147, 0.15)',
      },
      borderRadius: {
        pill: "9999px",
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
