/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Soft Peach brand palette — warm peachy-orange + coral accents,
      // paired with Tailwind's built-in slate for the neutral tones.
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
    },
  },
  plugins: [],
};
