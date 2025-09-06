import Parser from "rss-parser";
import type { SlideArticle, SlideJson } from "../src/types/ISlide";
import { fetchSlideOgpImageUrl } from "./utils";

const parser = new Parser();

type DocswellRssJson = Array<{
  title: string;
  link: string;
  isoDate: string;
  categories: string[];
}>;

const convertXmlToJson = async (url: string) => {
  const feed = await parser.parseURL(url);
  const items = feed.items.map((data) => {
    return data;
  });
  return items as DocswellRssJson;
};

const createSlideArticles = async (rss: DocswellRssJson) => {
  const slideArticles: { [key: string]: SlideArticle } = {};

  for (const item of rss) {
    console.log(`create slide info: ${item.title}`);

    const ogpImageUrl = await fetchSlideOgpImageUrl(item.link);

    const slideArticle: SlideArticle = {
      title: item.title,
      link: item.link,
      pubDate: item.isoDate,
      ogpImageUrl: ogpImageUrl,
      category: item.categories || ["Docswell"],
      platform: "docswell",
    };

    slideArticles[slideArticle.link] = slideArticle;
  }

  return slideArticles;
};

(async () => {
  const slideJson: SlideJson = {
    lastUpdated: new Date().toISOString(),
    articles: {},
  };

  // Docswell RSS のみを取得（要求通り）
  const docswellRss = await convertXmlToJson("https://www.docswell.com/users/korosuke613/rss");
  const docswellArticles = await createSlideArticles(docswellRss);
  
  slideJson.articles = { ...docswellArticles };

  console.log(JSON.stringify(slideJson, null, 2));
})();