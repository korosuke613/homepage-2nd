import Parser from "rss-parser";
const parser = new Parser();
import { HatenaArticle } from "../../src/types/IHatena";
import { BlogDataGenerator } from "./BlogDataGenerator";
import { fetchHatenaOgpImageUrl } from "./utils";

export type HatenaXML = {
  feed: {
    link: Array<{
      "@_rel": "first" | "next" | "alternate";
      "@_href": string;
    }>;
    entry: Array<{
      link: Array<{
        "@_rel": "edit" | "alternate";
        "@_type"?: string;
        "@_href": string;
      }>;
      title: string;
      updated: string;
      published: string;
      "app:edited": string;
      category?:
        | Array<{
            "@_term": string;
          }>
        | {
            "@_term": string;
          };
      "app:control": {
        "app:draft": "no" | "yes";
      };
    }>;
  };
};

export type HatenaRssJson = Array<{
  title: string;
  link: string;
  isoDate: string;
  enclosure: {
    url: string;
  };
  categories: string[];
}>;

export class HatenaBlogDataGenerator extends BlogDataGenerator<HatenaArticle> {
  protected XML_URL = "https://korosuke613.hatenablog.com/rss";

  protected async getXml(url: string): Promise<HatenaRssJson> {
    const feed = await parser.parseURL(url);
    return feed.items.map((data) => {
      return data;
    }) as HatenaRssJson;
  }

  async update() {
    console.info(`info: download XML from ${this.XML_URL}`);

    const hatenaRssJson = await this.getXml(this.XML_URL);
    const updatedAt = new Date(this.blogDate.lastUpdated);

    for (const r of hatenaRssJson) {
      if (updatedAt > new Date(r.isoDate)) {
        console.info(`info: skip ${r.title}`);
        continue;
      }

      console.info(`info: add ${r.title}`);
      this.updateItemCount += 1;

      const id = r.link.replace("?utm_source=feed", "");
      this.blogDate.articles[id] = {
        title: r.title,
        link: id,
        pubDate: r.isoDate,
        ogpImageUrl: await fetchHatenaOgpImageUrl(r.link),
        category: r.categories,
      };
    }

    this.blogDate.lastUpdated = new Date().toISOString();

    if (this.updateItemCount === 0) {
      console.info("info: nothing update");
      return false;
    }

    return true;
  }
}
