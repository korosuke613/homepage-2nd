import type { MarkdownInstance, Page } from 'astro';

export interface IProjectFrontmatter {
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
export declare type ProjectFrontmatterPage = Page<
  MarkdownInstance<IProjectFrontmatter>
>;
