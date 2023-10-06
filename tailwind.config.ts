import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["var(--font-satoshi)"],
        clash: ["var(--font-clash)"],
      },
      colors: {
        body: "var(--body)",
        stroke: "var(--stroke)",
        "secondary-text": "var(--secondary-text)",
        blur: "var(--blur)",
        fade: "var(--fade)",
        error: "var(--error)",
        "brown-accent": "var(--brown-accent)",
        "orange-accent": "var(--orange-accent)",
        "hot-pink-accent": "var(--hot-pink-accent)",
        "light-pink-accent": "var(--light-pink-accent)",
        accent: "var(--accent)",
        hover: "var(--hover)",
      },
      boxShadow: {
        dropdown: "0px 4px 16px 0px rgba(0, 0, 0, 0.25);",
      },
      animation: {
        ping: "ping 200ms ease-in-out",
        "spin-words": "spin-words 10s infinite",
      },
      keyframes: {
        "spin-words": {
          "10%": { transform: "translateY(-112%)" },
          "25%": { transform: "translateY(-100%)" },
          "35%": { transform: "translateY(-212%)" },
          "50%": { transform: "translateY(-200%)" },
          "60%": { transform: "translateY(-312%)" },
          "75%": { transform: "translateY(-300%)" },
          "85%": { transform: "translateY(-412%)" },
          "100%": { transform: "translateY(-400%)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
