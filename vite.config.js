import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "spa-fallback",
      closeBundle() {
        const index = resolve("docs/index.html");
        copyFileSync(index, resolve("docs/404.html"));
      },
    },
  ],
  base: "./",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["mammoth"],
  },
  resolve: {
    alias: {
      mammoth: "mammoth/mammoth.browser.js",
    },
  },
});
