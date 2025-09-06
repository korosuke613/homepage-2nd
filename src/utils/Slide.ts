import fs from "node:fs";
import path from "node:path";

import type { DocswellJson, SlideData, SpeakerDeckJson, SlideShareJson } from "@/types/ISlide";
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

export const createSpeakerDeckData = (slides: SpeakerDeckJson["slides"]) => {
  const arraySlides: SlideData[] = Object.keys(slides).map((slideId) => {
    const slide = slides[slideId];
    if (slide === undefined) {
      throw new Error();
    }

    return {
      id: slideId,
      type: "speakerdeck",
      title: slide.title,
      pubDate: slide.pubDate,
      url: slide.url,
      embedUrl: slide.embedUrl,
      thumbnailUrl: slide.thumbnailUrl,
      category: ["SpeakerDeck"],
    };
  });

  return arraySlides;
};

export const createSlideShareData = (slides: SlideShareJson["slides"]) => {
  const arraySlides: SlideData[] = Object.keys(slides).map((slideId) => {
    const slide = slides[slideId];
    if (slide === undefined) {
      throw new Error();
    }

    return {
      id: slideId,
      type: "slideshare",
      title: slide.title,
      pubDate: slide.pubDate,
      url: slide.url,
      embedUrl: slide.embedUrl,
      thumbnailUrl: slide.thumbnailUrl,
      category: ["SlideShare"],
    };
  });

  return arraySlides;
};

// 静的なスライドデータ（どのプラットフォームにも属さない特別なスライド用）
export const createStaticSlideData = (): SlideData[] => {
  // 現在は空 - 必要に応じて手動でスライドを追加
  return [];
};

export const getSortedSlideData = async () => {
  try {
    // 各プラットフォームの動的データを読み込み
    let docswellData: SlideData[] = [];
    let speakerDeckData: SlideData[] = [];
    let slideShareData: SlideData[] = [];

    // Docswellデータの読み込み
    try {
      const docswellJsonFile = await fs.promises.readFile(
        "./public/assets/docswell_slides.json",
      );
      const docswellJson: DocswellJson = JSON.parse(
        docswellJsonFile.toString(),
      );
      docswellData = createDocswellData(docswellJson.slides);
    } catch (_error) {
      console.warn("Docswell slides JSON not found, skipping");
    }

    // SpeakerDeckデータの読み込み
    try {
      const speakerDeckJsonFile = await fs.promises.readFile(
        "./public/assets/speakerdeck_slides.json",
      );
      const speakerDeckJson: SpeakerDeckJson = JSON.parse(
        speakerDeckJsonFile.toString(),
      );
      speakerDeckData = createSpeakerDeckData(speakerDeckJson.slides);
    } catch (_error) {
      console.warn("SpeakerDeck slides JSON not found, skipping");
    }

    // SlideShareデータの読み込み
    try {
      const slideShareJsonFile = await fs.promises.readFile(
        "./public/assets/slideshare_slides.json",
      );
      const slideShareJson: SlideShareJson = JSON.parse(
        slideShareJsonFile.toString(),
      );
      slideShareData = createSlideShareData(slideShareJson.slides);
    } catch (_error) {
      console.warn("SlideShare slides JSON not found, skipping");
    }

    // 静的データと動的データを結合
    const staticData = createStaticSlideData();

    // 重複を除去（IDベース）
    const allSlides = [...staticData];
    const existingIds = new Set(staticData.map((slide) => slide.id));

    // 各プラットフォームのデータを追加（重複チェック）
    for (const slide of [...docswellData, ...speakerDeckData, ...slideShareData]) {
      if (!existingIds.has(slide.id)) {
        allSlides.push(slide);
        existingIds.add(slide.id);
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
