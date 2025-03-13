import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './apps/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    breakpoints: {
      desktop: '1920px',
    },
    extend: {
      colors: {
        headings: 'var(--headings)',
        text: 'var(--text)',
        input: {
          background: 'var(--input-background)',
          placeholder: 'var(--input-placeholder)',
          border: 'var(--input-border)',
          text: 'var(--input-text)',
          hover: 'var(--input-hover)',
        },
        brand: 'var(--brand)',
        button: {
          background: 'var(--button-background)',
          border: 'var(--button-border)',
          text: 'var(--button-text)',
          hover: {
            background: 'var(--button-hover-background)',
            border: 'var(--button-hover-border)',
            text: 'var(--button-hover-text)',
          },
          outline: {
            background: 'var(--button-outline-background)',
            border: 'var(--button-outline-border)',
            text: 'var(--button-outline-text)',
            hover: {
              background: 'var(--button-outline-hover-background)',
              border: 'var(--button-outline-hover-border)',
              text: 'var(--button-outline-hover-text)',
            },
          },
        },
        border: 'var(--border)',
        // input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'var(--secondary-foreground)',
          'foreground-muted': 'var(--secondary-foreground-muted)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'hsl(var(--muted-foreground))',
          hover: 'hsl(var(--muted-hover))',
        },
        accent: {
          DEFAULT: 'var(--accent)',
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      maxWidth: {
        desktop: '1920px',
      },
    },
  },
  plugins: [tailwindcssAnimate, require('@tailwindcss/typography')],
}
