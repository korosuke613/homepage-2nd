import fs from "node:fs";
import type { SlideShareJson } from "../src/types/ISlide";

const readLocalSlideShareJson = async (path: string) => {
  try {
    const file = await fs.promises.readFile(path, "utf8");
    const slideShareJson: SlideShareJson = JSON.parse(file);
    return slideShareJson;
  } catch (_error) {
    // ファイルが存在しない場合は空の構造を返す
    return {
      lastUpdated: "1970-01-01T00:00:00Z",
      slides: {},
    };
  }
};

// SlideShareのスライドを手動で追加する関数
const addSlideShareSlide = (
  slideShareJson: SlideShareJson,
  slideId: string,
  title: string,
  pubDate: string,
  url: string,
  embedUrl?: string,
  thumbnailUrl?: string,
): SlideShareJson => {
  slideShareJson.slides[slideId] = {
    title: title,
    pubDate: pubDate,
    url: url,
    embedUrl: embedUrl,
    thumbnailUrl: thumbnailUrl,
  };

  slideShareJson.lastUpdated = new Date().toISOString();
  return slideShareJson;
};

(async () => {
  const localSlideShareJsonPath = "../public/assets/slideshare_slides.json";

  try {
    const localSlideShareJson = await readLocalSlideShareJson(
      localSlideShareJsonPath,
    );

    console.info("SlideShare slides manual update script");
    console.info("Add your slides manually by editing this script");
    
    // 例: スライドを手動で追加
    // const updatedJson = addSlideShareSlide(
    //   localSlideShareJson,
    //   "slide-id",
    //   "Slide Title",
    //   "2025-01-01T00:00:00Z",
    //   "https://www.slideshare.net/user/slide-id",
    //   "https://www.slideshare.net/slideshow/embed_code/slide-id"
    // );

    // 現在は何も更新しない
    const updatedJson = localSlideShareJson;

    await fs.promises.writeFile(
      localSlideShareJsonPath,
      `${JSON.stringify(updatedJson, null, 2)}\n`,
    );

    console.info("SlideShare slides file updated");
  } catch (error) {
    console.error("Error updating SlideShare slides:", error);
    process.exit(1);
  }
})();