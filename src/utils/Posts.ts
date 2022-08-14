import type { MarkdownInstance } from 'astro';

import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';

export const sortByDate = (posts: MarkdownInstance<IProjectFrontmatter>[]) => {
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.pubDate).valueOf() -
      new Date(a.frontmatter.pubDate).valueOf()
  );
};
