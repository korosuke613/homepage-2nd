import axios from "axios";
import { JSDOM } from "jsdom";
// eslint-disable-next-line node/no-unpublished-import
import { ZennJson } from "../src/types/IZenn";

// `/bin/ls -1 | grep .md` の結果
const articlesString = `
compare-renovate-dry-run.md
e82445a43782b1.md
easy-generate-pw-article.md
github_actions_history_all_list.md
productivity-weekly-1st-aniversary.md
productivity-weekly-20210106.md
productivity-weekly-20210113.md
productivity-weekly-20210120.md
productivity-weekly-20210127.md
productivity-weekly-20210203.md
productivity-weekly-20210210.md
productivity-weekly-20210217.md
productivity-weekly-20210224.md
productivity-weekly-20210303.md
productivity-weekly-20210310.md
productivity-weekly-20210317.md
productivity-weekly-20210324.md
productivity-weekly-20210331.md
productivity-weekly-20210408.md
productivity-weekly-20210414.md
productivity-weekly-20210421.md
productivity-weekly-20210428.md
productivity-weekly-20210512.md
productivity-weekly-20210519.md
productivity-weekly-20210526.md
productivity-weekly-20210602.md
productivity-weekly-20210609.md
productivity-weekly-20210616.md
productivity-weekly-20210623.md
productivity-weekly-20210630.md
productivity-weekly-20210707.md
productivity-weekly-20210715.md
productivity-weekly-20210721.md
productivity-weekly-20210728.md
productivity-weekly-20210804.md
productivity-weekly-20210811.md
productivity-weekly-20210818.md
productivity-weekly-20210825.md
productivity-weekly-20210901.md
productivity-weekly-20210908.md
productivity-weekly-20210915.md
productivity-weekly-20210922.md
productivity-weekly-20210929.md
productivity-weekly-20211006.md
productivity-weekly-20211013.md
productivity-weekly-20211020.md
productivity-weekly-20211027.md
productivity-weekly-20211108.md
productivity-weekly-20211117.md
productivity-weekly-20211124.md
productivity-weekly-20211201.md
productivity-weekly-20211208.md
productivity-weekly-20211215.md
productivity-weekly-20211222.md
productivity-weekly-20220105.md
productivity-weekly-20220112.md
productivity-weekly-20220119.md
productivity-weekly-20220126.md
productivity-weekly-20220203.md
productivity-weekly-20220209.md
productivity-weekly-20220216.md
productivity-weekly-20220223.md
productivity-weekly-20220309.md
productivity-weekly-20220316.md
productivity-weekly-20220323.md
productivity-weekly-20220330.md
productivity-weekly-20220406.md
productivity-weekly-20220413.md
productivity-weekly-20220420.md
productivity-weekly-20220427.md
productivity-weekly-20220511.md
productivity-weekly-20220518.md
productivity-weekly-20220525.md
productivity-weekly-20220601.md
productivity-weekly-20220608.md
productivity-weekly-20220615.md
productivity-weekly-20220622.md
productivity-weekly-20220629.md
productivity-weekly-20220706.md
productivity-weekly-20220713.md
productivity-weekly-20220720.md
productivity-weekly-20220727.md
productivity-weekly-20220803.md
productivity-weekly-20220810.md
productivity-weekly-20220817.md
productivity-weekly-20220824.md
productivity-weekly-20220831.md
productivity-weekly-20220907.md
productivity-weekly-20220914.md
productivity-weekly-20220921.md
productivity-weekly-20220928.md
productivity-weekly-20221005.md
productivity-weekly-20221012.md
productivity-weekly-20221019.md
productivity-weekly-20221026.md
productivity-weekly-20221102.md
productivity-weekly-20221109.md
productivity-weekly-20221116.md
productivity-weekly-20221207.md
productivity-weekly-20221214.md
productivity-weekly-20221221.md
productivity-weekly-20230111.md
productivity-weekly-20230125.md
productivity-weekly-20230208.md
productivity-weekly-20230222.md
productivity-weekly-20230308.md
productivity-weekly-20230315.md
productivity-weekly-20230405.md
productivity-weekly-20230426.md
productivity-weekly-20230510.md
productivity-weekly-20230517.md
productivity-weekly-20230531.md
productivity-weekly-20230607.md
productivity-weekly-20230614.md
productivity-weekly-20230628.md
vscode-jest-extension-with-asdf.md
zenn-metadata-updater.md
`;

const getArticleInfo = async (articleUrl: string) => {
  let ogpImageUrl = "";
  let title = "";
  let pubDate = "";
  let url = "";
  try {
    const res = await axios.get(articleUrl, {
      responseType: "document",
    });
    if (res === null) {
      throw new Error(`Failed to fetch ${articleUrl}`);
    }

    const dom = new JSDOM(res.data);
    ogpImageUrl = dom.window.document.head
      .querySelector("meta[property='og:image']")
      ?.attributes.getNamedItem("content")?.value;
    title = dom.window.document.head
      .querySelector("meta[property='og:title']")
      ?.attributes.getNamedItem("content")?.value;
    const rawPubDate = dom.window.document.body
      .querySelector("time")
      ?.attributes.getNamedItem("datetime")?.value;
    pubDate = new Date(rawPubDate).toISOString();
    url = res.request.res.responseUrl.replace("?redirected=1", "");
  } catch (e) {
    console.error(e);
  }
  return { title, ogpImageUrl, pubDate, url };
};

const sortZennJson = (zennJson: ZennJson) => {
  const sortedZennJson: ZennJson = {
    lastUpdated: zennJson.lastUpdated,
    articles: {},
  };

  // 日付で昇順
  const sortedKeys = Object.keys(zennJson.articles).sort((a, b) => {
    const aDate = new Date(zennJson.articles[a].pubDate);
    const bDate = new Date(zennJson.articles[b].pubDate);
    return aDate.getTime() - bDate.getTime();
  });

  for (const key of sortedKeys) {
    sortedZennJson.articles[key] = zennJson.articles[key];
  }

  return sortedZennJson;
};

const generateZennJson = async () => {
  const articles = articlesString.split("\n");
  const zennJson: ZennJson = {
    lastUpdated: new Date().toISOString(),
    articles: {},
  };

  for (const article of articles) {
    const id = article.replace(".md", "");
    if (id === "") {
      continue;
    }

    console.log(`id: ${id}`);

    const articleInfo = await getArticleInfo(
      `https://zenn.dev/korosuke613/articles/${id}`
    );
    if (articleInfo.ogpImageUrl === "" || articleInfo.title === "") {
      continue;
    }
    zennJson.articles[id] = articleInfo;
  }

  console.log(JSON.stringify(sortZennJson(zennJson), null, 2));
};

(async () => {
  await generateZennJson();
  //   await getArticleInfo(
  //     "https://zenn.dev/korosuke613/articles/productivity-weekly-20210106"
  //   )
})();
