import type { Page } from 'astro';

import type { BlogData } from './IZenn';

export interface IBlog {
  id: string;
  type: string;
  title: string;
  pubDate: string;
  url: string;
  ogpImageUrl: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export declare type BlogPage = Page<BlogData>;
