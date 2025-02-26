import defaultTheme from "tailwindcss/defaultTheme"
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors:{
        "brand-dk":  colors.slate['800'],
        "brand-lt": colors.zinc['50'],
        "brand-dk-hover": colors.zinc['100'],
        "brand-lt-hover": colors.slate['700'],
      },
      fontFamily: {
        sans: ['"Source Sans 3"', ...defaultTheme.fontFamily.sans],
        serif: ['"Source Serif 4"', ...defaultTheme.fontFamily.serif],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "full",
          },
        },
      },
      rotate: {
        "45": "45deg",
        "135": "135deg",
        "225": "225deg",
        "315": "315deg",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
