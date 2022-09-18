import type { MarkdownInstance, Page } from 'astro';

import type { StaticPost } from '@/utils/StaticPages';

export interface IArticleFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  order?: number;
  imgSrc: string;
  imgAlt: string;
  tags: string[];
  draft: boolean;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export declare type ArticleFrontmatterPage = Page<
  MarkdownInstance<IArticleFrontmatter>
>;

export type IContent = MarkdownInstance<IArticleFrontmatter> | StaticPost;
