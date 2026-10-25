// コンポーネントテストの story gallery を配信する Vite サーバーの設定。
// Astro は Vite の dev server を直接使えないので、gallery 専用に立てる。
import { resolve } from "node:path";

import { defineConfig } from "vite";

const projectRoot = resolve(import.meta.dirname, "..");

export default defineConfig({
  root: projectRoot,
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
  optimizeDeps: {
    entries: ["playwright/gallery/index.html"],
  },
  server: {
    port: 3100,
    strictPort: true,
  },
});
