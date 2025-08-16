import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class', // ✅ enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)'], // optional: using Poppins
      },
    },
  },
  plugins: [],
};

export default config;
