import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://webhook.site",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // removes '/api' prefix
      },
      "/main": {
        target: "https://spacestation.tunewave.in",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/main/, ""),
      },
      
    },
  },
});
