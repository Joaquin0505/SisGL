// tailwind.config.ts
import type { Config } from "tailwindcss";
import { createThemes } from 'tw-colors';
import colors, { black, white } from 'tailwindcss/colors';

const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink"
];

const shadeMaping = {
  "50": "900",
  "100": "800",
  "200": "700",
  "300": "600",
  "400": "500",
  "500": "400",
  "600": "300",
  "700": "200",
  "800": "100",
  "900": "50"
};

const generateThemeObject = (colors: any, mapping: any, invert = false) => {
  const theme: any = {};
  baseColors.forEach((color) => {
    theme[color] = {};
    Object.entries(mapping).forEach(([key, value]: any) => {
      const shadekey = invert ? value : key;
      theme[color][key] = colors[color][shadekey];
    });
  });
  return theme;
};

const lightTheme = generateThemeObject(colors, shadeMaping);
const darkTheme = generateThemeObject(colors, shadeMaping, true);

const theme = {
  light: {
    ...lightTheme,
    white: "#ffffff"
  },
  dark: {
    ...darkTheme,
    white: colors.gray["950"],
    black: colors.gray["50"]
  }
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'table-text': {
          light: colors.gray["800"], // Light mode text color
          dark: colors.gray["100"],  // Dark mode text color
        },
      },
    },
  },
  plugins: [createThemes(theme)],
};

export default config;
