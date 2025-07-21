import Parser from "rss-parser";

const parser = new Parser();

import fs from "node:fs";
import type { ZennScrapJson } from "../src/types/IZenn";

type ZennRssJsonWithScrap = Array<{
  title: string;
  link: string;
  isoDate: string;
  enclosure: {
    url: string;
  };
}>;

const convertXmlToJson = async (url: string) => {
  const feed = await parser.parseURL(url);
  const items = feed.items.map((data) => {
    return data;
  });
  return items as ZennRssJsonWithScrap;
};

const readLocalZennJson = async (path: string) => {
  const file = await fs.promises.readFile(path, "utf8");
  const zennScrapJson: ZennScrapJson = JSON.parse(file);

  return zennScrapJson;
};

let updateItemCount = 0;

const updateZennScrapJson = (
  updatedAtString: string,
  rss: ZennRssJsonWithScrap,
  zennScrapJson: ZennScrapJson,
): ZennScrapJson => {
  const updatedAt = new Date(updatedAtString);

  for (const r of rss) {
    if (!r.link.includes("scraps")) {
      console.info(`info: skip ${r.title}, because not scrap`);
      continue;
    }

    if (updatedAt > new Date(r.isoDate)) {
      console.info(`info: skip ${r.title}, because old date`);
      continue;
    }

    console.info(`info: add ${r.title}`);
    updateItemCount += 1;

    const id = r.link.split("/").pop();
    zennScrapJson.articles[id] = {
      title: r.title,
      pubDate: r.isoDate,
    };
  }

  zennScrapJson.lastUpdated = new Date().toISOString();

  return zennScrapJson;
};

(async () => {
  const localZennJsonPath = "../public/assets/zenn_scrap.json";

  const localZennJson = await readLocalZennJson(localZennJsonPath);
  const rss = await convertXmlToJson(
    "https://zenn.dev/korosuke613/feed?include_scraps=1",
  );
  const updatedZennJson = updateZennScrapJson(
    localZennJson.lastUpdated,
    rss,
    localZennJson,
  );

  if (updateItemCount === 0) {
    console.info("info: nothing update");
    return;
  }

  await fs.promises.writeFile(
    localZennJsonPath,
    `${JSON.stringify(updatedZennJson, null, 2)}\n`,
  );
})();
