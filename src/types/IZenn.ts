export type ZennJson = {
  lastUpdated: string;
  articles: {
    [key: string]: {
      title: string;
      ogpImageUrl: string;
      pubDate: string;
    };
  };
};

export type BlogData = {
  id: string;
  type: string;
  ogpImageUrl: string;
  title: string;
  pubDate: string;
  url: string;
  category: string[];
};
