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

export type ZennScrapJson = {
  lastUpdated: string;
  articles: {
    [key: string]: {
      title: string;
      pubDate: string;
    };
  };
};
