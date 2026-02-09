/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-color)',
          100: 'var(--primary-color)',
          200: 'var(--primary-color)',
          300: 'var(--primary-color)',
          400: 'var(--primary-color)',
          500: 'var(--primary-color)',
          600: 'var(--primary-hover)',
          700: 'var(--primary-hover)',
          800: 'var(--primary-hover)',
          900: 'var(--primary-hover)',
        },
        dark: {
          50: 'var(--bg-primary)',
          100: 'var(--bg-primary)',
          200: 'var(--bg-secondary)',
          300: 'var(--bg-tertiary)',
          400: 'var(--text-tertiary)',
          500: 'var(--text-secondary)',
          600: 'var(--text-secondary)',
          700: 'var(--bg-tertiary)',
          800: 'var(--bg-secondary)',
          900: 'var(--bg-primary)',
        }
      },
      backgroundColor: {
        skin: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        }
      },
      textColor: {
        skin: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverted: 'var(--text-inverse)',
        }
      },
      borderColor: {
        skin: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}