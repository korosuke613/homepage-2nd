import { describe, expect, test } from "vitest";
import { getRandomArticle } from "@/utils/Random";

describe("getRandomArticle", () => {
  const mockPosts = [
    {
      id: "post1",
      slug: "test-post",
      collection: "posts",
      url: "posts/test-post",
      data: {
        title: "Test Post",
        description: "Post description",
        pubDate: new Date("2023-01-01"),
        imgSrc: "/image.jpg",
        tags: ["test"],
      },
    },
  ];

  const mockBlogs = [
    {
      title: "Test Blog",
      url: "https://example.com/blog",
      ogpImageUrl: "/blog-image.jpg",
      pubDate: "2023-02-01",
      id: "blog1",
      type: "hatena",
      category: ["test"],
    },
  ];

  const mockSlides = [
    {
      id: "slide1",
      type: "docswell",
      title: "Test Slide",
      pubDate: "2023-03-01",
      url: "https://example.com/slide",
      thumbnailUrl: "/slide-thumbnail.jpg",
      category: ["test"],
    },
  ];

  test("uses a random index when not specified", async () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.25; // Should select index 0 with 3 items
    global.Math = mockMath;

    const result = getRandomArticle(mockPosts, mockBlogs, mockSlides);

    expect(result.type).toBe("post");
    expect(result.title).toBe("Test Post");
  });

  test("selects a post when articleIndex is 0", () => {
    const result = getRandomArticle(mockPosts, mockBlogs, mockSlides, {
      articleIndex: 0,
    });
    expect(result.type).toBe("post");
    expect(result.title).toBe("Test Post");
    expect(result.url).toContain("posts/test-post");
    expect(result.description).toBe("Post description");
    expect(result.imageSrc).toBe("/image.jpg");
    expect(result.totalCount).toBe(3);
  });

  test("selects a blog when articleIndex is 1", () => {
    const result = getRandomArticle(mockPosts, mockBlogs, mockSlides, {
      articleIndex: 1,
    });
    expect(result.type).toBe("blog");
    expect(result.title).toBe("Test Blog");
    expect(result.url).toBe("https://example.com/blog");
    expect(result.imageSrc).toBe("/blog-image.jpg");
    expect(result.totalCount).toBe(3);
  });

  test("selects a slide when articleIndex is 2", () => {
    const result = getRandomArticle(mockPosts, mockBlogs, mockSlides, {
      articleIndex: 2,
    });
    expect(result.type).toBe("slide");
    expect(result.title).toBe("Test Slide");
    expect(result.url).toBe("https://example.com/slide");
    expect(result.imageSrc).toBe("/slide-thumbnail.jpg");
    expect(result.totalCount).toBe(3);
  });

  test("returns error info when no articles are available", () => {
    const result = getRandomArticle([], [], [], { articleIndex: 0 });
    expect(result.type).toBe("post");
    expect(result.title).toBe("記事が見つかりませんでした");
    expect(result.url).toBe("");
    expect(result.totalCount).toBe(0);
  });

  test("returns error info when index is out of bounds", () => {
    const result = getRandomArticle(mockPosts, mockBlogs, mockSlides, {
      articleIndex: 10,
    });
    expect(result.title).toBe("記事が見つかりませんでした");
    expect(result.url).toBe("");
    expect(result.totalCount).toBe(3);
  });
});
