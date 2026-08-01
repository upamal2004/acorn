/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: "#FFF7F2",
          100: "#FFEDE0",
          200: "#FFD7BF",
          300: "#FFB98F",
          400: "#FF9460",
          500: "#FB713F",
          600: "#E8552A",
          700: "#C03F1E",
        },
        coral: {
          50: "#FFF1F0",
          100: "#FFE0DE",
          400: "#FF8A7A",
          500: "#FF6B5E",
          600: "#E84A3D",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(251, 113, 63, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
