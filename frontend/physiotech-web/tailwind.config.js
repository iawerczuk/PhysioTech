/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#102363",
          navySoft: "#E6EBF7", // bardzo jasny granat na hover/tła
        },
      },
    },
  },
  plugins: [],
};