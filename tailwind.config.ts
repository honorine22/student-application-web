import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        etp: {
          ink: "#14211d",
          accent: "#d9f65a",
          surface: "#f1f3f4",
          muted: "#68736d",
        },
      },
      boxShadow: {
        "etp-card": "0 22px 70px rgba(20, 33, 29, 0.11)",
      },
    },
  },
  plugins: [],
};
export default config;
