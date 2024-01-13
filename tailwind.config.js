// const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      "max-xs": { max: "360px" },
      sm: "640px",
      "max-sm": { max: "640px" },
      md: "768px",
      "max-md": { max: "768px" },
      tb: "816px",
      "max-tb": { max: "816px" },
      lg: "1024px",
      "max-lg": { max: "1024px" },
      xl: "1280px",
      "max-xl": { max: "1280px" },
      "2xl": "1536px",
      "max-2xl": { max: "1536px" }
    },
    fontSize: {
      us: ["0.625rem", { lineHeight: "1.5rem" }],
      xs: ["0.75rem", { lineHeight: "1.5rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      fine: ["0.9375rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.5rem" }],
      xl: ["1.25rem", { lineHeight: "1.5rem" }],
      "2xl": ["1.5rem", { lineHeight: "1.5rem" }],
      "3xl": ["1.875rem", { lineHeight: "1.5rem" }],
      "4xl": ["2.25rem", { lineHeight: "1.5rem" }],
      "5xl": ["3rem", { lineHeight: "1.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "1.5rem" }],
      "7xl": ["4.5rem", { lineHeight: "1.5rem" }],
      "8xl": ["6rem", { lineHeight: "1.5rem" }],
      "9xl": ["8rem", { lineHeight: "1.5rem" }]
    },
    extend: {
      colors: {
        purple: {
          1: "#ED03EC"
        }
      },
      borderRadius: {
        2: "0.5rem",
        "2.5xl": "18px",
        half: "0.3125rem"
      }
    }
  },
  plugins: []
};
