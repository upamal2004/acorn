import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for the Peach app. Nothing fancy here — just React + a sensible
// dev server that can be deployed straight to Vercel / Firebase Hosting.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Split vendor libraries into their own chunks so the app shell stays small
  // and the browser can cache Firebase / React independently.
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});
