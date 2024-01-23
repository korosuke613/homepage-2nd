import type { BlogDataJson } from "./IBlogData";

export type HatenaArticle = {
  title: string;
  link: string;
  pubDate: string;
  ogpImageUrl: string;
  category: string[];
};

export type HatenaJson = BlogDataJson<HatenaArticle>;
