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
          // References CSS custom properties defined in globals.css
          // These automatically adapt for light/dark mode via :root and .dark selectors
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-tertiary': 'var(--color-text-tertiary)',
          accent: 'var(--color-accent)',
          'accent-blue': 'var(--color-accent-blue)',
          'accent-purple': 'var(--color-accent-purple)',
          border: 'var(--color-border)',

          // Static colors (not theme-dependent)
          cream: '#FAF9F5',        // Light mode background
          charcoal: '#141413',     // Light mode primary text
          ink: '#252522',          // Dark mode background
          gray: {
            light: '#A8A7A3',      // Dark mode secondary text
            medium: '#3D3D3A',     // Light mode secondary text
            border: 'rgba(31, 30, 29, 0.15)',
          },
          terracotta: '#CC6B4A',   // Primary accent
          blue: '#2E5A91',         // Secondary accent
          purple: '#9B8FD6',       // Tertiary accent
          soft: '#F8F7F4',         // Light subtle backgrounds
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0.5': '0.5px',
        '2': '2px',
      },
      fontFamily: {
        'sans': ['Avenir', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
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
