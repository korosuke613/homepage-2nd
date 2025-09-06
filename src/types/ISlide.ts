export type SlideArticle = {
  title: string;
  link: string;
  pubDate: string;
  ogpImageUrl: string;
  category: string[];
  platform: "slideshare" | "speakerdeck" | "docswell";
};

export type SlideJson = {
  lastUpdated: string;
  articles: {
    [key: string]: SlideArticle;
  };
};
