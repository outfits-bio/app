import type { Config } from "tailwindcss";

import base from "./base";

export default {
  content: base.content,
  presets: [base],
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
          '100%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        ping: 'ping 200ms ease-in-out',
        'spin-words': 'spin-words 10s infinite',
        'spin-cd': 'spin 30s linear infinite',
        like: 'like .6s ease-in-out',
      },
    },
  },
} satisfies Config;
