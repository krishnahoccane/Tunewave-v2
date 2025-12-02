import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://spacestation.tunewave.in",
        changeOrigin: true,
        secure: false,
        // Keep the /api prefix, just proxy it
      },
      "/main": {
        target: "https://spacestation.tunewave.in",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/main/, ""),
      },
      "/wp": {
        target: "http://spacestation.tunewave.in",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wp/, ""), // Remove /wp prefix, WordPress API is at root
      },
    },
  },
});
