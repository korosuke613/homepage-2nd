import axios from "axios";
import { JSDOM } from "jsdom";
// eslint-disable-next-line node/no-unpublished-import
import { ZennScrapJson } from "../src/types/IZenn";

const scrapIdsString = `
8236994b2d2929
c0b9dc86d54d0b
703218980ddc5d
84794d9baed038
d7b3e3c5db452f
b1b25238404bc7
c06f1f923c7bdf
15388abb99d210
adbb2a6cf29a5d
50fa7f63d01773
062ed98c904eca
7155762df0c293
f91dedf3890a65
b2d7b8f44ae7f6
f43dd22a243e18
dc18529983a95e
7f6fb33da4e632
d4e81c5a5fab74
5024ca81623aa0
5fd242b7f76aa7
dcb0bd4f27284c
d88fecec74fdf9
dcc883e4ab8625
0eef7641bcd48f
6b8a88c88d4479
07729cd55a628b
74e6ccaf6f8b67
4e465aad5538d0
27fcee8d1f809a
25df6314ffef7e
c7fe1f67607ad9
cc7b64522ed443
e05f28c8f93673
d7718856c6e7d3
d7367ec10a8d04
`;

const getScrapInfo = async (
  scrapUrl: string
): Promise<ZennScrapJson["articles"]["key"]> => {
  let title = "";
  let pubDate = "";
  try {
    const res = await axios.get(scrapUrl, {
      responseType: "document",
    });
    if (res === null) {
      throw new Error(`Failed to fetch ${scrapUrl}`);
    }

    const dom = new JSDOM(res.data);
    title = dom.window.document.head
      .querySelector("meta[property='og:title']")
      ?.attributes.getNamedItem("content")?.value;
    const rawPubDate = dom.window.document
      .querySelectorAll("time")[1] // 一つ目に登場する要素はクローズ日時であるため
      ?.attributes.getNamedItem("datetime")?.value;
    pubDate = new Date(rawPubDate).toISOString();
  } catch (e) {
    console.error(e);
  }
  return { title, pubDate };
};

const sortZennScrapJson = (zennScrapJson: ZennScrapJson) => {
  const sortedZennJson: ZennScrapJson = {
    lastUpdated: zennScrapJson.lastUpdated,
    articles: {},
  };

  // 日付で昇順
  const sortedKeys = Object.keys(zennScrapJson.articles).sort((a, b) => {
    const aDate = new Date(zennScrapJson.articles[a].pubDate);
    const bDate = new Date(zennScrapJson.articles[b].pubDate);
    return aDate.getTime() - bDate.getTime();
  });

  for (const key of sortedKeys) {
    sortedZennJson.articles[key] = zennScrapJson.articles[key];
  }

  return sortedZennJson;
};

const generateZennScrapJson = async () => {
  const scrapIds = scrapIdsString.split("\n");
  const zennScrapJson: ZennScrapJson = {
    lastUpdated: new Date().toISOString(),
    articles: {},
  };

  for (const scrapId of scrapIds) {
    const id = scrapId.replace(".md", "");
    if (id === "") {
      continue;
    }

    console.log(`id: ${id}`);

    const scrapInfo = await getScrapInfo(
      `https://zenn.dev/korosuke613/scraps/${id}`
    );
    if (scrapInfo.title === "") {
      continue;
    }
    zennScrapJson.articles[id] = scrapInfo;
  }

  console.log(JSON.stringify(sortZennScrapJson(zennScrapJson), null, 2));
};

(async () => {
  await generateZennScrapJson();
  //   await getArticleInfo(
  //     "https://zenn.dev/korosuke613/articles/productivity-weekly-20210106"
  //   )
})();
