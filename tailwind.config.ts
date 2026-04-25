import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F4EF",
        text: "#1E1E1E",
        muted: "#6F6A61",
        border: "#D8D2C8",
        accent: "#3F5F46",
        "accent-secondary": "#A35F3D"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      maxWidth: {
        reading: "44rem"
      },
      letterSpacing: {
        label: "0.12em"
      }
    }
  },
  plugins: [typography]
};

export default config;
