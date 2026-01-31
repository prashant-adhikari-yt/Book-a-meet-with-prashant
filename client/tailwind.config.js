/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8B5E3C",
        "primary-dark": "#6B4A2E",
        "primary-light": "#A67C52",
      },
    },
  },
  plugins: [],
};
