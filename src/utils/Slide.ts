import fs from "node:fs";
import path from "node:path";
import type { SlideJson } from "@/types/ISlide";
import type { SlideData } from "@/types/ISlidePage";
import { AppConfig } from "@/utils/AppConfig";

export const createSlideData = (articles: SlideJson["articles"]) => {
  const arrayArticles: SlideData[] = Object.keys(articles).map((articleId) => {
    const article = articles[articleId];
    if (article === undefined) {
      throw new Error();
    }

    return {
      id: articleId,
      type: article.platform,
      ogpImageUrl: article.ogpImageUrl,
      url: article.link,
      title: article.title,
      pubDate: article.pubDate,
      category: [...article.category],
    };
  });

  return arrayArticles;
};

export const getSortedSlideData = async () => {
  const slideJsonFile = await fs.promises.readFile(
    "./public/assets/slides.json",
  );
  const slideJson: SlideJson = JSON.parse(slideJsonFile.toString());
  const slideData = createSlideData(slideJson.articles);

  const sortedSlideData = slideData.sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
  );

  return sortedSlideData;
};

export function generateSlideImagePath(...paths: string[]) {
  return path.join(AppConfig.base, "assets", "images", ...paths);
}
