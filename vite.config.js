import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "./",
  optimizeDeps: {
    include: ["mammoth"],
  },
  resolve: {
    alias: {
      mammoth: "mammoth/mammoth.browser.js",
    },
  },
});
