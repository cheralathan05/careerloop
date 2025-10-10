// client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Tell Tailwind where to find your files to scan for classes
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};