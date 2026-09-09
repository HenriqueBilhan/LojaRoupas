/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0E0E0F",
          surface: "#17171A",
          border: "#2A2A2E",
        },
        ink: {
          DEFAULT: "#F2F1EC",
          muted: "#9A9A9E",
        },
        accent: {
          DEFAULT: "#A855F7",
          dark: "#8B2FE0",
        },
        sale: "#FF4747",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
