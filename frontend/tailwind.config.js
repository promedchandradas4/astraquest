/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#050914",
          900: "#0a0f1f",
          800: "#0d1730",
          700: "#132043",
        },
        "moon-blue": "#3b82f6",
        "mars-orange": "#f97316",
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
