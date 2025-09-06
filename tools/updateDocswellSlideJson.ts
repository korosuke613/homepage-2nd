import Parser from "rss-parser";

const parser = new Parser();

import fs from "node:fs";
import type { DocswellJson } from "../src/types/ISlide";

type DocswellRssJson = Array<{
  title: string;
  link: string;
  isoDate: string;
  content?: string;
  contentSnippet?: string;
}>;

const convertXmlToJson = async (url: string) => {
  const feed = await parser.parseURL(url);
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
  } catch (error) {
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
    if (!r.link.includes("docswell.com")) {
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
    const slideId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    
    docswellJson.slides[slideId] = {
      title: r.title,
      pubDate: r.isoDate,
      url: r.link,
      embedUrl: r.link.includes("/s/") ? r.link.replace("/s/", "/slide/").replace(/\/[^\/]+$/, "/embed") : undefined,
    };
  }

  docswellJson.lastUpdated = new Date().toISOString();

  return docswellJson;
};

(async () => {
  const localDocswellJsonPath = "../public/assets/docswell_slides.json";

  try {
    const localDocswellJson = await readLocalDocswellJson(localDocswellJsonPath);
    
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