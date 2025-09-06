import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["media:thumbnail"],
  },
});

import fs from "node:fs";
import type { DocswellJson } from "../src/types/ISlide";

type DocswellRssJson = Array<{
  title: string;
  link: string;
  isoDate: string;
  content?: string;
  contentSnippet?: string;
  "media:thumbnail"?: {
    $: {
      url: string;
    };
  };
}>;

const convertXmlToJson = async (url: string) => {
  const feed = await parser.parseURL(url);

  console.log(JSON.stringify(feed, null, 2));
  const items = feed.items.map((data) => {
    return data;
  });
  return items as DocswellRssJson;
};

const readLocalDocswellJson = async (path: string) => {
  try {
    const file = await fs.promises.readFile(path, "utf8");
    const docswellJson: DocswellJson = JSON.parse(file);
    return docswellJson;
  } catch (_error) {
    // ファイルが存在しない場合は空の構造を返す
    return {
      lastUpdated: "1970-01-01T00:00:00Z",
      slides: {},
    };
  }
};

let updateItemCount = 0;

const updateDocswellJson = (
  updatedAtString: string,
  rss: DocswellRssJson,
  docswellJson: DocswellJson,
): DocswellJson => {
  const updatedAt = new Date(updatedAtString);

  for (const r of rss) {
    let urlObj;
    try {
      urlObj = new URL(r.link);
    } catch (_e) {
      console.info(`info: skip ${r.title}, invalid URL`);
      continue;
    }
    const allowedHosts = ["docswell.com", "www.docswell.com"];
    if (!allowedHosts.includes(urlObj.hostname)) {
      console.info(`info: skip ${r.title}, because not docswell`);
      continue;
    }

    if (updatedAt > new Date(r.isoDate)) {
      console.info(`info: skip ${r.title}, because old date`);
      continue;
    }

    console.info(`info: add ${r.title}`);
    updateItemCount += 1;

    // URLからスライドIDを抽出
    const urlParts = r.link.split("/");
    const slideId =
      urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

    // タイトルの頭に `[スライド]` とついてしまうので取り除く
    const title = r.title.replace(/^\[スライド\] /, "");

    docswellJson.slides[slideId] = {
      title: title,
      pubDate: r.isoDate,
      thumbnailUrl: r["media:thumbnail"].$.url,
      url: r.link,
    };
  }

  docswellJson.lastUpdated = new Date().toISOString();

  return docswellJson;
};

(async () => {
  const localDocswellJsonPath = "../public/assets/docswell_slides.json";

  try {
    const localDocswellJson = await readLocalDocswellJson(
      localDocswellJsonPath,
    );

    // DocswellのRSS URL（推定）
    const rssUrl = "https://www.docswell.com/user/korosuke613/feed";

    console.info(`Fetching RSS from: ${rssUrl}`);
    const rss = await convertXmlToJson(rssUrl);

    const updatedDocswellJson = updateDocswellJson(
      localDocswellJson.lastUpdated,
      rss,
      localDocswellJson,
    );

    if (updateItemCount === 0) {
      console.info("info: nothing to update");
      return;
    }

    await fs.promises.writeFile(
      localDocswellJsonPath,
      `${JSON.stringify(updatedDocswellJson, null, 2)}\n`,
    );

    console.info(`Successfully updated ${updateItemCount} slides`);
  } catch (error) {
    console.error("Error updating Docswell slides:", error);
    process.exit(1);
  }
})();
