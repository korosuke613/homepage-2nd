export type BlogDataJson<T> = {
  lastUpdated: string;
  articles: {
    [key: string]: T;
  };
};
