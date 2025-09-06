import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  createDocswellData,
  createSlideShareData,
  createSpeakerDeckData,
  createStaticSlideData,
  generateImagePath,
  getSortedSlideData,
} from "@/utils/Slide";

describe("createDocswellData", () => {
  it("should transform Docswell slides into SlideData format", () => {
    const docswellSlides = {
      slide1: {
        title: "Docswell Slide 1",
        pubDate: "2023-01-01T00:00:00.000Z",
        url: "https://docswell.com/s/user/slide1",
        thumbnailUrl: "https://docswell.com/thumb1.jpg",
      },
      slide2: {
        title: "Docswell Slide 2",
        pubDate: "2023-01-02T00:00:00.000Z",
        url: "https://docswell.com/s/user/slide2",
        thumbnailUrl: "https://docswell.com/thumb2.jpg",
      },
    };

    const result = createDocswellData(docswellSlides);

    expect(result).toEqual([
      {
        id: "slide1",
        type: "docswell",
        title: "Docswell Slide 1",
        pubDate: "2023-01-01T00:00:00.000Z",
        url: "https://docswell.com/s/user/slide1",
        thumbnailUrl: "https://docswell.com/thumb1.jpg",
        category: ["Docswell"],
      },
      {
        id: "slide2",
        type: "docswell",
        title: "Docswell Slide 2",
        pubDate: "2023-01-02T00:00:00.000Z",
        url: "https://docswell.com/s/user/slide2",
        thumbnailUrl: "https://docswell.com/thumb2.jpg",
        category: ["Docswell"],
      },
    ]);
  });
});

describe("createSpeakerDeckData", () => {
  it("should transform SpeakerDeck slides into SlideData format", () => {
    const speakerDeckSlides = {
      deck1: {
        title: "SpeakerDeck Slide 1",
        pubDate: "2023-02-01T00:00:00.000Z",
        url: "https://speakerdeck.com/user/deck1",
        thumbnailUrl: "https://speakerdeck.com/thumb1.jpg",
      },
    };

    const result = createSpeakerDeckData(speakerDeckSlides);

    expect(result).toEqual([
      {
        id: "deck1",
        type: "speakerdeck",
        title: "SpeakerDeck Slide 1",
        pubDate: "2023-02-01T00:00:00.000Z",
        url: "https://speakerdeck.com/user/deck1",
        thumbnailUrl: "https://speakerdeck.com/thumb1.jpg",
        category: ["SpeakerDeck"],
      },
    ]);
  });
});

describe("createSlideShareData", () => {
  it("should transform SlideShare slides into SlideData format", () => {
    const slideShareSlides = {
      share1: {
        title: "SlideShare Slide 1",
        pubDate: "2023-03-01T00:00:00.000Z",
        url: "https://slideshare.net/user/share1",
        thumbnailUrl: "https://slideshare.net/thumb1.jpg",
      },
    };

    const result = createSlideShareData(slideShareSlides);

    expect(result).toEqual([
      {
        id: "share1",
        type: "slideshare",
        title: "SlideShare Slide 1",
        pubDate: "2023-03-01T00:00:00.000Z",
        url: "https://slideshare.net/user/share1",
        thumbnailUrl: "https://slideshare.net/thumb1.jpg",
        category: ["SlideShare"],
      },
    ]);
  });
});

describe("createStaticSlideData", () => {
  it("should return empty array", () => {
    const result = createStaticSlideData();
    expect(result).toEqual([]);
  });
});

describe("getSortedSlideData", () => {
  it("should return sorted slide data from all platforms", async () => {
    const docswellJson = {
      slides: {
        docswell1: {
          title: "Docswell Slide",
          pubDate: "2023-01-01T00:00:00.000Z",
          url: "https://docswell.com/s/user/docswell1",
          thumbnailUrl: "https://docswell.com/thumb1.jpg",
        },
      },
    };

    const speakerDeckJson = {
      slides: {
        speaker1: {
          title: "SpeakerDeck Slide",
          pubDate: "2023-01-03T00:00:00.000Z",
          url: "https://speakerdeck.com/user/speaker1",
          thumbnailUrl: "https://speakerdeck.com/thumb1.jpg",
        },
      },
    };

    const slideShareJson = {
      slides: {
        share1: {
          title: "SlideShare Slide",
          pubDate: "2023-01-02T00:00:00.000Z",
          url: "https://slideshare.net/user/share1",
          thumbnailUrl: "https://slideshare.net/thumb1.jpg",
        },
      },
    };

    vi.spyOn(fs.promises, "readFile")
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(docswellJson)))
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(speakerDeckJson)))
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(slideShareJson)));

    const result = await getSortedSlideData();

    expect(result).toHaveLength(3);
    // 日付でソートされていることを確認（新しい順）
    expect(result[0]?.title).toBe("SpeakerDeck Slide"); // 2023-01-03
    expect(result[1]?.title).toBe("SlideShare Slide"); // 2023-01-02
    expect(result[2]?.title).toBe("Docswell Slide"); // 2023-01-01
  });

  it("should handle missing JSON files gracefully", async () => {
    vi.spyOn(fs.promises, "readFile")
      .mockRejectedValueOnce(new Error("File not found"))
      .mockRejectedValueOnce(new Error("File not found"))
      .mockRejectedValueOnce(new Error("File not found"));

    const result = await getSortedSlideData();

    // 静的データのみ返される（現在は空配列）
    expect(result).toEqual([]);
  });

  it("should remove duplicates based on ID", async () => {
    const docswellJson = {
      slides: {
        duplicate1: {
          title: "Docswell Slide",
          pubDate: "2023-01-01T00:00:00.000Z",
          url: "https://docswell.com/s/user/duplicate1",
          thumbnailUrl: "https://docswell.com/thumb1.jpg",
        },
      },
    };

    const speakerDeckJson = {
      slides: {
        duplicate1: {
          // 同じIDで重複
          title: "SpeakerDeck Slide",
          pubDate: "2023-01-02T00:00:00.000Z",
          url: "https://speakerdeck.com/user/duplicate1",
          thumbnailUrl: "https://speakerdeck.com/thumb1.jpg",
        },
      },
    };

    const slideShareJson = {
      slides: {},
    };

    vi.spyOn(fs.promises, "readFile")
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(docswellJson)))
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(speakerDeckJson)))
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(slideShareJson)));

    const result = await getSortedSlideData();

    // 重複除去により1つのみ残る（最初に追加されたDocswell）
    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe("docswell");
  });

  it("should handle JSON parsing errors", async () => {
    vi.spyOn(fs.promises, "readFile")
      .mockResolvedValueOnce(Buffer.from("invalid json"))
      .mockResolvedValueOnce(Buffer.from("invalid json"))
      .mockResolvedValueOnce(Buffer.from("invalid json"));

    const result = await getSortedSlideData();

    // エラーハンドリングにより静的データが返される
    expect(result).toEqual([]);
  });

  it("should handle file system errors and return static data", async () => {
    vi.spyOn(fs.promises, "readFile").mockImplementation(() => {
      throw new Error("File system error");
    });

    const result = await getSortedSlideData();

    // エラーハンドリングにより静的データが返される
    expect(result).toEqual([]);
  });
});

describe("generateImagePath", () => {
  it("should generate correct image path", () => {
    const result = generateImagePath("slides", "thumbnail.jpg");
    expect(result).toContain("assets/images/slides/thumbnail.jpg");
  });

  it("should handle multiple path segments", () => {
    const result = generateImagePath("slides", "2023", "thumbnail.jpg");
    expect(result).toContain("assets/images/slides/2023/thumbnail.jpg");
  });

  it("should handle empty paths", () => {
    const result = generateImagePath();
    expect(result).toContain("assets/images");
  });
});
