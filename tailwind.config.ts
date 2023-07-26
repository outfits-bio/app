import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        urbanist: ["var(--font-urbanist)"],
      },
      animation: {
        ping: "ping 200ms ease-in-out",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
