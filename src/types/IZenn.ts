export type ZennJson = {
  lastUpdated: string;
  articles: {
    [key: string]: {
      title: string;
      ogpImageUrl: string;
      pubDate: string;
      url: string;
    };
  };
};
