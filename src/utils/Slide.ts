import fs from "node:fs";
import path from "node:path";

import type { DocswellJson, SlideData } from "@/types/ISlide";
import { AppConfig } from "@/utils/AppConfig";

export const createDocswellData = (slides: DocswellJson["slides"]) => {
  const arraySlides: SlideData[] = Object.keys(slides).map((slideId) => {
    const slide = slides[slideId];
    if (slide === undefined) {
      throw new Error();
    }

    return {
      id: slideId,
      type: "docswell",
      title: slide.title,
      pubDate: slide.pubDate,
      url: slide.url,
      embedUrl: slide.embedUrl,
      thumbnailUrl: slide.thumbnailUrl,
      category: ["Docswell"],
    };
  });

  return arraySlides;
};

// 静的なSlideShareとSpeakerDeckのデータ（手動追加用）
export const createStaticSlideData = (): SlideData[] => {
  // 既存の投稿から抽出したスライドデータ
  return [
    {
      id: "dd3ecf4be4604ccfb0997af775118ee4",
      type: "speakerdeck",
      title:
        "Git/GitHub を使う上で知っておくと嬉しいかも Tips【サイボウズ新人研修2025】",
      pubDate: "2025-07-08T00:00:00Z",
      url: "https://speakerdeck.com/korosuke613/dd3ecf4be4604ccfb0997af775118ee4",
      embedUrl:
        "https://speakerdeck.com/player/dd3ecf4be4604ccfb0997af775118ee4",
      category: ["SpeakerDeck"],
    },
  ];
};

export const getSortedSlideData = async () => {
  try {
    // Docswellの動的データを読み込み（存在する場合）
    let docswellData: SlideData[] = [];
    try {
      const docswellJsonFile = await fs.promises.readFile(
        "./public/assets/docswell_slides.json",
      );
      const docswellJson: DocswellJson = JSON.parse(
        docswellJsonFile.toString(),
      );
      docswellData = createDocswellData(docswellJson.slides);
    } catch (_error) {
      console.warn("Docswell slides JSON not found, using static data only");
    }

    // 静的データと動的データを結合
    const staticData = createStaticSlideData();

    // 重複を除去（IDベース）
    const allSlides = [...staticData];
    const existingIds = new Set(staticData.map((slide) => slide.id));

    for (const slide of docswellData) {
      if (!existingIds.has(slide.id)) {
        allSlides.push(slide);
      }
    }

    // 日付順でソート
    const sortedSlideData = allSlides.sort(
      (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
    );

    return sortedSlideData;
  } catch (error) {
    console.error("Error loading slide data:", error);
    return createStaticSlideData();
  }
};

export function generateImagePath(...paths: string[]) {
  return path.join(AppConfig.base, "assets", "images", ...paths);
}
