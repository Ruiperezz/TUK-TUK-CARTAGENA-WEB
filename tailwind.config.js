/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0F1419",
          secondary: "#0B0E12",
          tertiary: "#141A22"
        },
        gold: {
          DEFAULT: "#C9A961",
          hover: "#D9B971"
        },
        cream: "#F8F6F1"
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
