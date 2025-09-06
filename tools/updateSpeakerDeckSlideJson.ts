import fs from "node:fs";
import type { SpeakerDeckJson } from "../src/types/ISlide";

const readLocalSpeakerDeckJson = async (path: string) => {
  try {
    const file = await fs.promises.readFile(path, "utf8");
    const speakerDeckJson: SpeakerDeckJson = JSON.parse(file);
    return speakerDeckJson;
  } catch (_error) {
    // ファイルが存在しない場合は空の構造を返す
    return {
      lastUpdated: "1970-01-01T00:00:00Z",
      slides: {},
    };
  }
};

// SpeakerDeckのスライドを手動で追加する関数
const addSpeakerDeckSlide = (
  speakerDeckJson: SpeakerDeckJson,
  slideId: string,
  title: string,
  pubDate: string,
  url: string,
  embedUrl?: string,
  thumbnailUrl?: string,
): SpeakerDeckJson => {
  speakerDeckJson.slides[slideId] = {
    title: title,
    pubDate: pubDate,
    url: url,
    embedUrl: embedUrl,
    thumbnailUrl: thumbnailUrl,
  };

  speakerDeckJson.lastUpdated = new Date().toISOString();
  return speakerDeckJson;
};

(async () => {
  const localSpeakerDeckJsonPath = "../public/assets/speakerdeck_slides.json";

  try {
    const localSpeakerDeckJson = await readLocalSpeakerDeckJson(
      localSpeakerDeckJsonPath,
    );

    console.info("SpeakerDeck slides manual update script");
    console.info("Add your slides manually by editing this script");
    
    // 例: スライドを手動で追加
    // const updatedJson = addSpeakerDeckSlide(
    //   localSpeakerDeckJson,
    //   "slide-id",
    //   "Slide Title",
    //   "2025-01-01T00:00:00Z",
    //   "https://speakerdeck.com/korosuke613/slide-id",
    //   "https://speakerdeck.com/player/slide-id"
    // );

    // 現在は何も更新しない
    const updatedJson = localSpeakerDeckJson;

    await fs.promises.writeFile(
      localSpeakerDeckJsonPath,
      `${JSON.stringify(updatedJson, null, 2)}\n`,
    );

    console.info("SpeakerDeck slides file updated");
  } catch (error) {
    console.error("Error updating SpeakerDeck slides:", error);
    process.exit(1);
  }
})();