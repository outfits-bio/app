import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        urbanist: ["var(--font-urbanist)"],
      },
      colors: {
        body: "var(--body)",
        stroke: "var(--stroke)",
        "secondary-text": "var(--secondary-text)",
        blur: "var(--blur)",
        fade: "var(--fade)",
        error: "var(--error)",
        "blue-accent": "var(--blue-accent)",
        "orange-accent": "var(--orange-accent)",
        "red-accent": "var(--red-accent)",
        "purple-accent": "var(--purple-accent)",
        hover: "var(--hover)",
      },
      animation: {
        ping: "ping 200ms ease-in-out",
        "spin-words": "spin-words 6s infinite",
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
  plugins: [],
} satisfies Config;
