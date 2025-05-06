import path from "node:path";
import { getCollection } from "astro:content";
import { AppConfig } from "@/utils/AppConfig";
import * as BlogModule from "@/utils/Blog";
import { getRandomArticle } from "@/utils/Random";
import { type Mock, beforeEach, describe, expect, test, vi } from "vitest";

// Mock the external dependencies
vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

vi.mock("@/utils/Blog", () => ({
  getSortedBlogData: vi.fn(),
}));

vi.mock("@/utils/AppConfig", () => ({
  AppConfig: {
    base: "/base",
  },
}));

describe("getRandomArticle", () => {
  const mockPosts = [
    {
      id: "post1",
      slug: "test-post",
      collection: "posts",
      data: {
        title: "Test Post",
        description: "Post description",
        pubDate: new Date("2023-01-01"),
        imgSrc: "/image.jpg",
      },
    },
  ];

  const mockBlogs = [
    {
      title: "Test Blog",
      url: "https://example.com/blog",
      ogpImageUrl: "/blog-image.jpg",
      pubDate: "2023-02-01",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (getCollection as Mock).mockResolvedValue(mockPosts);
    (BlogModule.getSortedBlogData as Mock).mockResolvedValue(mockBlogs);
  });

  test("returns a post article when selected randomly", async () => {
    // Force selection of the post (index 0)
    const result = await getRandomArticle({ articleIndex: 0 });

    expect(result).toEqual({
      title: "Test Post",
      description: "Post description",
      url: path.join(AppConfig.base, "posts", "test-post"),
      type: "post",
      imageSrc: "/image.jpg",
      totalCount: 2,
      pubDate: mockPosts[0]?.data.pubDate.toString(),
    });

    expect(getCollection).toHaveBeenCalledWith("posts");
    expect(BlogModule.getSortedBlogData).toHaveBeenCalled();
  });

  test("returns a blog article when selected randomly", async () => {
    // Force selection of the blog (index 1)
    const result = await getRandomArticle({ articleIndex: 1 });

    expect(result).toEqual({
      title: "Test Blog",
      description: "",
      url: "https://example.com/blog",
      type: "blog",
      imageSrc: "/blog-image.jpg",
      totalCount: 2,
      pubDate: "2023-02-01",
    });

    expect(getCollection).toHaveBeenCalledWith("posts");
    expect(BlogModule.getSortedBlogData).toHaveBeenCalled();
  });

  test("returns a fallback when no article is found", async () => {
    (getCollection as Mock).mockResolvedValue([]);
    (BlogModule.getSortedBlogData as Mock).mockResolvedValue([]);

    const result = await getRandomArticle();

    expect(result).toEqual({
      title: "記事が見つかりませんでした",
      description: "記事が見つかりませんでした",
      url: "",
      type: "post",
      totalCount: 0,
      pubDate: "",
    });
  });

  test("uses a random index when not specified", async () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.25; // Should select index 0 with 2 items
    global.Math = mockMath;

    const result = await getRandomArticle();

    expect(result.type).toBe("post");
    expect(result.title).toBe("Test Post");
  });
});
