/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
