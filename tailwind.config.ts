import type { Config } from "tailwindcss";
// eslint-disable-next-line import/no-extraneous-dependencies 
import tailwindScrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      lineClamp: {
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      animation: {
        fade: "fadein 0.7s ease-in-out",
        shake: "shake 2s ease-in-out infinite",
        spin: "spin 1.5s linear infinite",
      },
      keyframes: {
        spin: {
          to: { rotate: "360deg" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "10%, 90%": { rotate: "-0.3deg" },
          "20%, 80%": { rotate: "0.1deg" },
          "30%, 50%, 70%": { rotate: "-0.5deg" },
          "40%, 60%": { rotate: "0.2deg" },
        },
      },
      colors: {
        background: {
          DEFAULT: '#E0EFF5',
          dark: '#111218'
        },
        foreground: {
          DEFAULT: '#0e0e0e',
          dark: '#fefefe'
        },
        primary: {
          DEFAULT: '#00D5FF',
          dark: '#00AFD4'
        },
        red: {
          DEFAULT: '#EF4943'
        }
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
      fontFamily: {
        sans: ["var(--sans)"],
        mono: ["var(--mono)"],
      },
    },
  },

  plugins: [tailwindScrollbar],
};
export default config;