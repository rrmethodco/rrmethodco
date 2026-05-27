import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf9",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        dark: {
          DEFAULT: "#0B1F1F",
          50: "#1A3535",
          100: "#152D2D",
          200: "#112626",
        },
        coral: {
          DEFAULT: "#E05A47",
          50: "#FEF2F0",
          100: "#FDE0DB",
          200: "#FABDB3",
          300: "#F39585",
          400: "#E97260",
          500: "#E05A47",
          600: "#C43F2E",
          700: "#9E3224",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
