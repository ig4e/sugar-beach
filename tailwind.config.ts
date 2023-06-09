import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        padding: "1rem",
      },
      fontFamily: {
        inter: "Inter, Arial, sans-serif",
      },
    },
  },
  plugins: [],
} satisfies Config;
