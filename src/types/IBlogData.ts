export type BlogDataJson<T> = {
  lastUpdated: string;
  articles: {
    [key: string]: T;
  };
};

export type HatenaArticle = {
  title: string;
  link: string;
  pubDate: string;
  ogpImageUrl: string;
  category: string[];
};
