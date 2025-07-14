// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"], // sets poppins as default sans
      },
    },
  },
  plugins: [],
};
export default config;
