import path from "node:path";
import type { IPost } from "@/types/IArticleFrontmatter";
import type { BlogData } from "@/types/IBlogPage";
import { AppConfig } from "./AppConfig";

export type RandomArticle = {
  title: string;
  description: string;
  url: string;
  type: "post" | "blog" | "none";
  imageSrc?: string;
  totalCount: number; // 総記事数を追加
  pubDate: string; // 投稿日を追加
};

type IPostOmitUrl = Omit<IPost, "url">;

/**
 * PostsとBlogsからランダムな記事を1つ取得する
 */
export const getRandomArticle = (
  posts: IPost[],
  blogs: BlogData[],
  config?: {
    articleIndex?: number;
  },
): RandomArticle => {
  // Postsのデータを取得
  const postsData: IPostOmitUrl[] = posts.map((post) => ({
    data: post.data,
    slug: post.slug,
    collection: post.collection,
    id: post.id,
  }));

  // 全ての記事を1つの配列に統合
  type MixedArticle = {
    source: "post" | "blog";
    data: IPostOmitUrl | BlogData;
  };

  const allArticles: MixedArticle[] = [
    ...postsData.map((post): MixedArticle => ({ source: "post", data: post })),
    ...blogs.map((blog): MixedArticle => ({ source: "blog", data: blog })),
  ];

  const totalArticleCount = allArticles.length;

  // ランダムなインデックスを選択
  const randomIndex =
    config?.articleIndex ?? Math.floor(Math.random() * allArticles.length);

  // ランダムな記事を選択
  const randomArticle = allArticles[randomIndex];

  if (!randomArticle) {
    return {
      title: "記事が見つかりませんでした",
      description: "記事が見つかりませんでした",
      url: "",
      type: "post",
      totalCount: totalArticleCount,
      pubDate: "",
    };
  }

  // 型ガード関数
  function isPostArticle(article: IPostOmitUrl | BlogData): article is IPost {
    return "slug" in article && "data" in article;
  }

  function isBlogArticle(
    article: IPostOmitUrl | BlogData,
  ): article is BlogData {
    return "title" in article && "url" in article;
  }

  // 選択された記事を適切な形式に変換
  if (isPostArticle(randomArticle.data)) {
    const post = randomArticle.data;
    return {
      title: post.data.title,
      description: post.data.description || "",
      url: path.join(AppConfig.base, "posts", post.slug),
      type: "post",
      imageSrc: post.data.imgSrc,
      totalCount: totalArticleCount,
      pubDate: post.data.pubDate.toString(),
    };
  }
  if (isBlogArticle(randomArticle.data)) {
    const blog = randomArticle.data;
    return {
      title: blog.title,
      description: "",
      url: blog.url,
      type: "blog",
      imageSrc: blog.ogpImageUrl,
      totalCount: totalArticleCount,
      pubDate: blog.pubDate,
    };
  }

  return {
    title: "記事が見つかりませんでした",
    description: "記事が見つかりませんでした",
    url: "",
    type: "none",
    totalCount: totalArticleCount,
    pubDate: "",
  };
};
