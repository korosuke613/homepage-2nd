import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import type { HatenaArticle, HatenaJson } from "../src/types/IHatena";
import type { HatenaXML } from "./HatenaXML";
import { fetchHatenaOgpImageUrl } from "./utils";

const HATENA_ENDPOINT_URL =
  "https://blog.hatena.ne.jp/korosuke613/korosuke613.hatenablog.com/atom/entry";

const getHatenaData = async (url: string) => {
  const res = await axios.get(url, {
    auth: {
      username: process.env.HATENA_NAME,
      password: process.env.HATENA_PASS,
    },
  });

  return res.data;
};

const parseXML = async (getData: string): Promise<HatenaXML> => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  return parser.parse(getData);
};

const getCategory = (
  category:
    | Array<{
        "@_term": string;
      }>
    | {
        "@_term": string;
      }
    | undefined,
) => {
  if (category === undefined) {
    return [];
  }
  if (Array.isArray(category)) {
    return category.map((c) => c["@_term"]);
  }
  return [category["@_term"]];
};

const createHatenaArticlesForPage = async (hatenaXML: HatenaXML) => {
  const hatenaArticles: { [key: string]: HatenaArticle } = {};

  for (const entry of hatenaXML.feed.entry) {
    if (entry["app:control"]["app:draft"] === "yes") {
      continue;
    }
    console.log(`create article info: ${entry.title}`);

    const link = entry.link.find((l) => l["@_rel"] === "alternate")["@_href"];

    const category = getCategory(entry.category);

    const ogpImageUrl = await fetchHatenaOgpImageUrl(link);

    const hatenaArticle: HatenaArticle = {
      title: entry.title,
      link: link,
      pubDate: entry.updated, // 実質的な publish date は updated になる
      ogpImageUrl: ogpImageUrl,
      category: category,
    };

    hatenaArticles[hatenaArticle.link] = hatenaArticle;
  }

  return hatenaArticles;
};

const pagenateHatenaArticles = async (url: string) => {
  console.log(`pagenation: ${url}`);
  const hatenaData = await getHatenaData(url);
  const parsedData = await parseXML(hatenaData);
  const hatenaArticles = await createHatenaArticlesForPage(parsedData);
  const hasNextPage = parsedData.feed.link.some((l) => l["@_rel"] === "next");

  let nextPage = "";
  if (hasNextPage) {
    nextPage = parsedData.feed.link.find((l) => l["@_rel"] === "next")[
      "@_href"
    ];
  }

  return { hatenaArticles, nextPage };
};

(async () => {
  const hatenaJson: HatenaJson = {
    lastUpdated: new Date().toISOString(),
    articles: {},
  };

  const firstPagenation = await pagenateHatenaArticles(HATENA_ENDPOINT_URL);
  hatenaJson.articles = { ...firstPagenation.hatenaArticles };
  let nextUrl = firstPagenation.nextPage;

  while (nextUrl !== "") {
    const pagenation = await pagenateHatenaArticles(nextUrl);
    hatenaJson.articles = {
      ...hatenaJson.articles,
      ...pagenation.hatenaArticles,
    };
    nextUrl = pagenation.nextPage;
  }

  console.log(JSON.stringify(hatenaJson, null, 2));
})();
