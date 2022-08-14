import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import { astroImageTools } from 'astro-imagetools';
import image from '@astrojs/image';
import compress from 'astro-compress';
import rehypeExternalLinks from 'rehype-external-links';

import partytown from '@astrojs/partytown';
// eslint-disable-next-line import/extensions
import { setupTags } from './src/utils/TagIntegration.mjs';

// https://astro.build/config
export default defineConfig({
  base: '/draft-new-my-homepage', // Set a path prefix.
  site: 'https://korosuke613.github.io',
  // Use to generate your sitemap and canonical URLs in your final build.
  // Important!
  // Only official '@astrojs/*' integrations are currently supported by Astro.
  // Add 'experimental.integrations: true' to make 'astro-robots-txt' working
  // with 'astro build' command.
  experimental: {
    integrations: true,
  },
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'monokai',
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: '_blank', rel: ['noopener', 'noreferrer'] },
      ],
    ],
  },
  integrations: [
    react(),
    tailwind({}),
    sitemap(),
    robotsTxt(),
    astroImageTools,
    image(),
    compress(),
    partytown(),
    setupTags(),
  ],
});
