import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";

import partytown from "@astrojs/partytown";
// eslint-disable-next-line import/extensions
import { setupKorosuke } from "./src/utils/Integration.mjs";

// https://astro.build/config
export default defineConfig({
  cacheDir: ".astro/cache",
  base: "/", // Set a path prefix.
  site: "https://korosuke613.dev/",
  // Use to generate your sitemap and canonical URLs in your final build.
  // Important!
  // Only official '@astrojs/*' integrations are currently supported by Astro.
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "monokai",
    },
    remarkPlugins: [],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
  vite: {
    optimizeDeps: {
      exclude: ["fsevents"],
    },
  },
  integrations: [
    react(),
    tailwind({}),
    sitemap(),
    robotsTxt(),
    partytown(),
    setupKorosuke(),
    mdx(),
  ],
});
