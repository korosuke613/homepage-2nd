import axios from "axios";
import { JSDOM } from "jsdom";

export const fetchHatenaOgpImageUrl = async (articleUrl: string) => {
  let ogpImageUrl = "";

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
  } catch (e) {
    console.error(e);
    return "";
  }
  return ogpImageUrl;
};
