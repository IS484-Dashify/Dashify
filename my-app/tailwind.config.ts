import type { Config } from "tailwindcss";

const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        pri: {
          100: "#dce4f9",
          200: "#b9c9f3",
          300: "#95aeec",
          400: "#7293e6",
          500: "#4f78e0", // ! new primary colour
          600: "#3f60b3",
          700: "#2f4886",
          800: "#20305a",
          900: "#10182d"
        },
        sec: {
          100: "#e5f7fe",
          200: "#cbeffd",
          300: "#b1e6fb",
          400: "#97defa",
          500: "#7dd6f9", // ! new secondary colour
          600: "#64abc7",
          700: "#4b8095",
          800: "#325664",
          900: "#192b32"
        },
        "reddish": {
          100: "#ffa5a1",
          200: "#f01e2c"
        },
        "amberish": {
          100: "#ffc17a",
          200: "#ff7e00"
        },
        "greenish": {
          100: "#acdf87",
          200: "#4c9a2a"
        }
      },
      transitionProperty: {
        'multiple': 'width, height, backgroundColor, border-radius'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;