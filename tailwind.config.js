/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{jsx,tsx}",
    "./pages/**/*.{jsx,tsx}",
    "./common/**/*.{jsx,tsx}",
    "./components/**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        flow: {
          "0%": { backgroundPositionY: "0" },
          "100%": { backgroundPositionY: "100%" },
        },
      },
      animation: {
        flow: "flow 2s ease-in infinite alternate",
      },
    },
  },
  plugins: [],
};
