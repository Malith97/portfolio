import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0B",
        surface: "#151515",
        text: "#F3F0E8",
        muted: "#B0A99A",
        border: "#2A2822",
        accent: "#F2C75B",
        "accent-secondary": "#E2B449",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        reading: "44rem",
      },
      letterSpacing: {
        label: "0.12em",
      },
    },
  },
  plugins: [typography],
};

export default config;
