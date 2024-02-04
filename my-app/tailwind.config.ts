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
        "p-white": "#F2F3F4", // ! Background colour
        "indigo-d": {
          50: "#E7E9F7",
          100: "#e2dbf7",
          200: "#c4b7ef",
          300: "#a793e8",
          400: "#896fe0",
          500: "#6c4bd8", // ! main primary coloor
          600: "#563cad",
          700: "#412d82",
          800: "#2b1e56",
          900: "#160f2b"
        },
        "text": "#060828",
        "lavender": {
          100: "#ede9f3",
          200: "#dad3e8",
          300: "#c8bddc",
          400: "#b5a7d1",
          500: "#a391c5", // ! main secondary colour
          600: "#82749e",
          700: "#625776",
          800: "#413a4f",
          900: "#211d27"
        },
        "accent": {
          100: "#d1d3f0",
          200: "#a3a8e1",
          300: "#747cd2",
          400: "#4651c3",
          500: "#1825b4", // ! main accent colour
          600: "#131e90",
          700: "#0e166c",
          800: "#0a0f48",
          900: "#050724"
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
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;