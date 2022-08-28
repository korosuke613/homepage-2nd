import Parser from "rss-parser";
const parser = new Parser();
import fs from "node:fs";
// eslint-disable-next-line node/no-unpublished-import
import { HatenaJson } from "../src/types/IHatena";
import { fetchHatenaOgpImageUrl } from "./utils";

type HatenaRssJson = Array<{
  title: string;
  link: string;
  isoDate: string;
  enclosure: {
    url: string;
  };
  categories: string[];
}>;

const convertXmlToJson = async (url: string) => {
  const feed = await parser.parseURL(url);
  const items = feed.items.map((data) => {
    return data;
  });
  return items as HatenaRssJson;
};

const readLocalHatebaBlogJson = async (path: string) => {
  const file = await fs.promises.readFile(path, "utf8");
  const hatenaJson: HatenaJson = JSON.parse(file);

  return hatenaJson;
};

let updateItemCount = 0;

const updateHatenaBlogJson = async (
  updatedAtString: string,
  rss: HatenaRssJson,
  hatenaJson: HatenaJson
) => {
  const updatedAt = new Date(updatedAtString);

  for (const r of rss) {
    if (updatedAt > new Date(r.isoDate)) {
      console.info(`info: skip ${r.title}`);
      continue;
    }

    console.info(`info: add ${r.title}`);
    updateItemCount += 1;

    const id = r.link.replace("?utm_source=feed", "");
    hatenaJson.articles[id] = {
      title: r.title,
      link: id,
      pubDate: r.isoDate,
      ogpImageUrl: await fetchHatenaOgpImageUrl(r.link),
      category: r.categories,
    };
  }

  hatenaJson.lastUpdated = new Date().toISOString();

  return hatenaJson;
};

(async () => {
  const localHatenaBlogJsonPath = "../public/assets/hatena_blog.json";

  const localHatenaBlogJson = await readLocalHatebaBlogJson(
    localHatenaBlogJsonPath
  );
  const rss = await convertXmlToJson("https://korosuke613.hatenablog.com/rss");
  const updatedZennJson = await updateHatenaBlogJson(
    localHatenaBlogJson.lastUpdated,
    rss,
    localHatenaBlogJson
  );

  if (updateItemCount === 0) {
    console.info(`info: nothing update`);
    return;
  }

  await fs.promises.writeFile(
    localHatenaBlogJsonPath,
    JSON.stringify(updatedZennJson, null, 2) + "\n"
  );
})();
