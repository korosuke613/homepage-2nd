import fs from "node:fs";

import path from "path";

import type { BlogData } from "@/types/IBlogPage";
import type { HatenaJson } from "@/types/IHatena";
import type { ZennJson, ZennScrapJson } from "@/types/IZenn";
import { AppConfig } from "@/utils/AppConfig";

export const createZennData = (articles: ZennJson["articles"]) => {
  const arrayArticles: BlogData[] = Object.keys(articles).map((articleId) => {
    const article = articles[articleId];
    if (article === undefined) {
      throw new Error();
    }

    return {
      id: articleId,
      type: "zenn",
      ogpImageUrl: article.ogpImageUrl,
      url: article.url,
      title: article.title,
      pubDate: article.pubDate,
      category: ["Zenn"],
    };
  });

  return arrayArticles;
};

export const createZennScrapData = (articles: ZennScrapJson["articles"]) => {
  const arrayArticles: BlogData[] = Object.keys(articles).map((articleId) => {
    const article = articles[articleId];
    if (article === undefined) {
      throw new Error();
    }

    return {
      id: articleId,
      type: "zenn",
      ogpImageUrl: "/assets/images/zenn_scrap.webp", // スクラップには OGP 画像がない
      url: `https://zenn.dev/korosuke613/scraps/${articleId}`,
      title: article.title,
      pubDate: article.pubDate,
      category: ["Zenn scrap"],
    };
  });

  return arrayArticles;
};

export const createHatenaData = (articles: HatenaJson["articles"]) => {
  const arrayArticles: BlogData[] = Object.keys(articles).map((articleId) => {
    const article = articles[articleId];
    if (article === undefined) {
      throw new Error();
    }

    return {
      id: articleId,
      type: "hatena",
      ogpImageUrl: article.ogpImageUrl,
      url: article.link,
      title: article.title,
      pubDate: article.pubDate,
      category: ["Hatena", ...article.category],
    };
  });

  return arrayArticles;
};

export const getSortedBlogData = async () => {
  const hatenaBlogJsonFile = await fs.promises.readFile(
    "./public/assets/hatena_blog.json",
  );
  const hatenaJson: HatenaJson = JSON.parse(hatenaBlogJsonFile.toString());
  const hatenaData = createHatenaData(hatenaJson.articles);

  const zennJsonFile = await fs.promises.readFile("./public/assets/zenn.json");
  const zennJson: ZennJson = JSON.parse(zennJsonFile.toString());
  const sortedZenns = createZennData(zennJson.articles);

  const zennScrapJsonFile = await fs.promises.readFile(
    "./public/assets/zenn_scrap.json",
  );
  const zennScrapJson: ZennScrapJson = JSON.parse(zennScrapJsonFile.toString());
  const sortedZennScraps = createZennScrapData(zennScrapJson.articles);

  const sortedBlogData = [
    ...hatenaData,
    ...sortedZenns,
    ...sortedZennScraps,
  ].sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
  );

  return sortedBlogData;
};

export function generateImagePath(...paths: string[]) {
  return path.join(AppConfig.base, "assets", "images", ...paths);
}
