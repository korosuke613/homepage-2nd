import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

import { AppConfig } from '@/utils/AppConfig';

export const GET = async (context: APIContext) => {
  const posts = await getCollection('posts');
  const { site } = context;
  if (site === undefined) {
    throw new Error('context.site is undefined');
  }

  return rss({
    // `<title>` field in output xml
    title: AppConfig.title,
    // `<description>` field in output xml
    description: AppConfig.description,
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: site.toString(),
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.slug}`,
    })),
    // (optional) inject custom xml
    customData: `<language>ja-jp</language>`,
  });
};
