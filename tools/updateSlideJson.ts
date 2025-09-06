import Parser from "rss-parser";
import fs from "node:fs";
import type { SlideJson } from "../src/types/ISlide";
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

const readLocalSlideJson = async (path: string) => {
  const file = await fs.promises.readFile(path, "utf8");
  const slideJson: SlideJson = JSON.parse(file);

  return slideJson;
};

let updateItemCount = 0;

const updateSlideJson = async (
  updatedAtString: string,
  rss: DocswellRssJson,
  slideJson: SlideJson,
) => {
  const updatedAt = new Date(updatedAtString);

  for (const r of rss) {
    if (updatedAt > new Date(r.isoDate)) {
      console.info(`info: skip ${r.title}`);
      continue;
    }

    console.info(`info: add ${r.title}`);
    updateItemCount += 1;

    const id = r.link;
    slideJson.articles[id] = {
      title: r.title,
      link: id,
      pubDate: r.isoDate,
      ogpImageUrl: await fetchSlideOgpImageUrl(r.link),
      category: r.categories || ["Docswell"],
      platform: "docswell",
    };
  }

  slideJson.lastUpdated = new Date().toISOString();

  return slideJson;
};

(async () => {
  const localSlideJsonPath = "../public/assets/slides.json";

  const localSlideJson = await readLocalSlideJson(localSlideJsonPath);
  const rss = await convertXmlToJson("https://www.docswell.com/users/korosuke613/rss");
  const updatedSlideJson = await updateSlideJson(
    localSlideJson.lastUpdated,
    rss,
    localSlideJson,
  );

  if (updateItemCount === 0) {
    console.info("info: nothing update");
    return;
  }

  await fs.promises.writeFile(
    localSlideJsonPath,
    `${JSON.stringify(updatedSlideJson, null, 2)}\n`,
  );
})();