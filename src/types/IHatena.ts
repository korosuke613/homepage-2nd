export type HatenaArticle = {
  title: string;
  link: string;
  pubDate: string;
  ogpImageUrl: string;
  category: string[];
};

export type HatenaJson = {
  lastUpdated: string;
  articles: {
    [key: string]: HatenaArticle;
  };
};
