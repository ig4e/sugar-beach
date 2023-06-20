import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        padding: "1rem",
        screens: ["640px", "768px", "1024px", "1280px", "1420px"],
      },
      fontFamily: {
        inter: "Inter, Arial, sans-serif",
      },
    },
  },
  plugins: [],
} satisfies Config;
