const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        // avenir: ['Avenir', 'sans-serif'],
        // archivo: ['"Archivo Black"', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },

        text: {
          heading: 'hsl(var(--text-heading))',
          strong: 'hsl(var(--text-strong))',
          muted: 'hsl(var(--text-muted))',
          'muted-alt': 'hsl(var(--text-muted-alt))',
        },
        placeholder: {
          DEFAULT: 'hsl(var(--placeholder))',
          alt: 'hsl(var(--placeholder-alt))',
        },
        surface: 'hsl(var(--surface))',
        'input-bg': 'hsl(var(--input-bg))',
        separator: 'hsl(var(--separator))',
        scroll: 'hsl(var(--scroll))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addBase }) {
      addBase({
        '.custom-scroll::-webkit-scrollbar': {
          width: '4px',
        },
        '.custom-scroll::-webkit-scrollbar-track': {
          'border-radius': '9999px',
          'background-color': '#F3F4F6',
        },
        '.custom-scroll::-webkit-scrollbar-thumb': {
          'border-radius': '9999px',
          'background-color': '#E1E5EA',
        },
        '.dark .custom-scroll::-webkit-scrollbar-track': {
          'background-color': '#374151',
        },
        '.dark .custom-scroll::-webkit-scrollbar-thumb': {
          'background-color': '#4B5563',
        },
      })
    },
  ],
}
