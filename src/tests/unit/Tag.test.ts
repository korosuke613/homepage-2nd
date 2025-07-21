import { describe, expect, it } from "vitest";
import type { IPost } from "@/types/IArticleFrontmatter";
import {
  escapeTag,
  generateTags,
  generateTagsFromMarkdowns,
  readTags,
} from "@/utils/Tag";

describe("Tag", () => {
  describe("generateTags", () => {
    it("should generate tags with unique colors", () => {
      const tagNames = ["tag1", "tag2", "tag3", "tag4", "tag5"];
      const tags = generateTags(tagNames);

      const colors = Object.values(tags);
      const uniqueColors = new Set(colors);

      expect(colors.length).toEqual(tagNames.length);
      expect(uniqueColors.size).toEqual(tagNames.length);
    });
  });

  describe("generateTagsFromMarkdowns", () => {
    it("should generate tags from an array of markdowns", () => {
      const markdowns = [
        {
          data: {
            tags: ["tag1", "tag2"],
          },
        },
        {
          data: {
            tags: ["tag2", "tag3"],
          },
        },
      ];

      const tags = generateTagsFromMarkdowns(markdowns as IPost[]);

      expect(tags).toEqual({
        tag1: expect.any(String),
        tag2: expect.any(String),
        tag3: expect.any(String),
      });
    });
  });

  describe("escapeTag", () => {
    it("should replace forward slashes with underscores", () => {
      const tagName = "tag/with/slashes";
      const escapedTagName = escapeTag(tagName);

      expect(escapedTagName).toEqual("tag_with_slashes");
    });
  });

  describe("readTags", () => {
    it("should read tags from a file", async () => {
      const tags = await readTags(`${__dirname}/data/generated/tags.json`);

      expect(tags).toEqual({
        posts: expect.any(Object),
        blogs: expect.any(Object),
        // add more assertions here if necessary
      });
    });
  });
});
