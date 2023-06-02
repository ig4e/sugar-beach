import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container:{ 
        padding: "1rem"
      }
    },
  },
  plugins: [],
} satisfies Config;
