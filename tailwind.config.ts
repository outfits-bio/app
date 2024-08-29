/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";


export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'dbs-h': { raw: '(max-height: 820px)' },
        'xs-h': { raw: '(max-height: 850px)' },
        'sm-h': { raw: '(max-height: 860px)' },
        '2xs-h': { raw: '(max-height: 800px)' },
        '3xs-h': { raw: '(max-height: 750px)' },
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        body: 'var(--body)',
        stroke: 'var(--stroke)',
        'secondary-text': 'var(--secondary-text)',
        blur: 'var(--blur)',
        fade: 'var(--fade)',
        error: 'var(--error)',
        'brown-accent': 'var(--brown-accent)',
        'orange-accent': 'var(--orange-accent)',
        'hot-pink-accent': 'var(--hot-pink-accent)',
        'light-pink-accent': 'var(--light-pink-accent)',
        accent: 'var(--accent)',
        hover: 'var(--hover)',

        border: 'var(--stroke)',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'var(--body)',
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
        // accent: {
        //   DEFAULT: "hsl(var(--accent))",
        //   foreground: "hsl(var(--accent-foreground))",
        // },
        popover: {
          DEFAULT: 'var(--body)',
          foreground: 'hsl(var(--popover-foreground))',
          stroke: 'var(--stroke)',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        satoshi: ['var(--font-satoshi)'],
        clash: ['var(--font-clash)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        dropdown: '0px 4px 16px 0px rgba(0, 0, 0, 0.25);',
      },
      backdropBlur: {
        xs: '1px',
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
        'spin-words': {
          '10%': { transform: 'translateY(-112%)' },
          '25%': { transform: 'translateY(-100%)' },
          '35%': { transform: 'translateY(-212%)' },
          '50%': { transform: 'translateY(-200%)' },
          '60%': { transform: 'translateY(-312%)' },
          '75%': { transform: 'translateY(-300%)' },
          '85%': { transform: 'translateY(-412%)' },
          '100%': { transform: 'translateY(-400%)' },
        },
        like: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'like-color': {
          '0%': { color: 'inherit' },
          '100%': { color: '#ff6200' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        ping: 'ping 200ms ease-in-out',
        'spin-words': 'spin-words 10s infinite',
        'spin-cd': 'spin 30s linear infinite',
        like: 'like 0.45s cubic-bezier(0.17, 0.89, 0.32, 1.49), like-color 0.3s ease-in-out',
        'like-longer': 'like 1.5s cubic-bezier(0.17, 0.89, 0.32, 1.49), like-color 0.6s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
    require('tailwindcss-animate'),
  ],
} satisfies Config;
