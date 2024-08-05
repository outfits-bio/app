import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
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
    },
  },
} satisfies Config;
