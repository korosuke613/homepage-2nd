import fs from "node:fs";

import { getSortedBlogData } from "@/utils/Blog";

describe("getSortedBlogData", () => {
  it("returns an array of blog data sorted by publication date", async () => {
    const hatenaJson = {
      articles: [
        {
          title: "Hatena Blog Post",
          link: "https://example.com/hatena",
          pubDate: "2022-01-01T00:00:00.000Z",
          category: ["test"],
        },
      ],
    };
    const zennJson = {
      articles: [
        {
          title: "Zenn Blog Post",
          pubDate: "2022-01-02T00:00:00.000Z",
          url: "https://zenn.dev/korosuke613/articles/0",
          category: ["Zenn", "test"],
        },
      ],
    };
    const zennScrapJson = {
      articles: [
        {
          title: "Zenn Scrap Post",
          pubDate: "2022-01-03T00:00:00.000Z",
          category: ["Zenn scrap", "test"],
        },
      ],
    };
    jest
      .spyOn(fs.promises, "readFile")
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(hatenaJson)));
    jest
      .spyOn(fs.promises, "readFile")
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(zennJson)));
    jest
      .spyOn(fs.promises, "readFile")
      .mockResolvedValueOnce(Buffer.from(JSON.stringify(zennScrapJson)));

    const result = await getSortedBlogData();
    expect(result).toEqual([
      {
        title: "Zenn Scrap Post",
        url: "https://zenn.dev/korosuke613/scraps/0",
        pubDate: "2022-01-03T00:00:00.000Z",
        category: ["Zenn scrap"],
        type: "zenn",
        id: "0",
        ogpImageUrl: "/assets/images/zenn_scrap.webp",
      },
      {
        title: "Zenn Blog Post",
        url: "https://zenn.dev/korosuke613/articles/0",
        pubDate: "2022-01-02T00:00:00.000Z",
        category: ["Zenn"],
        type: "zenn",
        id: "0",
        ogpImageUrl: undefined,
      },
      {
        title: "Hatena Blog Post",
        url: "https://example.com/hatena",
        pubDate: "2022-01-01T00:00:00.000Z",
        category: ["Hatena", "test"],
        type: "hatena",
        id: "0",
        ogpImageUrl: undefined,
      },
    ]);
  });
});
