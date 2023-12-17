import Parser from "rss-parser";
const parser = new Parser();
import fs from "node:fs";
// eslint-disable-next-line node/no-unpublished-import
import { ZennJson } from "../src/types/IZenn";

type ZennRssJson = Array<{
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
  return items as ZennRssJson;
};

const readLocalZennJson = async (path: string) => {
  const file = await fs.promises.readFile(path, "utf8");
  const zennJson: ZennJson = JSON.parse(file);

  return zennJson;
};

let updateItemCount = 0;

const updateZennJson = (
  updatedAtString: string,
  rss: ZennRssJson,
  zennJson: ZennJson,
): ZennJson => {
  const updatedAt = new Date(updatedAtString);

  // 取得した RSS は新しい順に並んでいるので、古い順に並び替える
  for (const r of rss.reverse()) {
    if (updatedAt > new Date(r.isoDate)) {
      console.info(`info: skip ${r.title}`);
      continue;
    }

    console.info(`info: add ${r.title}`);
    updateItemCount += 1;

    const id = r.link.split("/").pop();
    zennJson.articles[id] = {
      title: r.title,
      ogpImageUrl: r.enclosure.url,
      pubDate: r.isoDate,
      url: r.link,
    };
  }

  zennJson.lastUpdated = new Date().toISOString();

  return zennJson;
};

(async () => {
  const localZennJsonPath = "../public/assets/zenn.json";

  const localZennJson = await readLocalZennJson(localZennJsonPath);
  const rss = await convertXmlToJson("https://zenn.dev/korosuke613/feed");
  const updatedZennJson = updateZennJson(
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
