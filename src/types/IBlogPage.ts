import type { Page } from "astro";

export interface IBlog {
  id: string;
  type: string;
  title: string;
  pubDate: string;
  url: string;
  ogpImageUrl: string;
}

export type BlogData = {
  id: string;
  type: string;
  ogpImageUrl: string;
  title: string;
  pubDate: string;
  url: string;
  category: string[];
};

export declare type BlogPage = Page<BlogData>;
