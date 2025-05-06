import type { Meta, StoryObj } from "@storybook/react";
import { RandomArticleCard } from "./RandomArticleCard";

const meta: Meta<typeof RandomArticleCard> = {
  title: "RandomArticleCard",
  component: RandomArticleCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RandomArticleCard>;

export const Post: Story = {
  args: {
    initialArticle: {
      title: "サンプル記事タイトル",
      description:
        "これはサンプル記事の説明文です。記事の内容を簡潔に説明しています。",
      url: "/posts/sample-post",
      type: "post",
      imageSrc: "https://placehold.jp/800x450.png",
      totalCount: 42,
      pubDate: "2023-05-15",
    },
  },
};

export const Blog: Story = {
  args: {
    initialArticle: {
      title: "サンプルブログ記事",
      description: "これはブログ記事の説明文です。",
      url: "https://example.com/blog/sample",
      type: "blog",
      imageSrc: "https://placehold.jp/3d4070/ffffff/800x450.png",
      totalCount: 42,
      pubDate: "2023-06-20",
    },
  },
};

export const NoImage: Story = {
  args: {
    initialArticle: {
      title: "画像なしの記事",
      description: "この記事には画像が設定されていません。",
      url: "/posts/no-image",
      type: "post",
      totalCount: 42,
      pubDate: "2023-07-05",
    },
  },
};

export const NoDescription: Story = {
  args: {
    initialArticle: {
      title: "説明なしの記事",
      description: "",
      url: "/posts/no-description",
      type: "blog",
      imageSrc: "https://placehold.jp/30/454545/ffffff/800x450.png",
      totalCount: 42,
      pubDate: "2023-08-10",
    },
  },
};

export const None: Story = {
  args: {
    initialArticle: {
      title: "記事が見つかりませんでした",
      description: "記事が見つかりませんでした",
      url: "",
      type: "none",
      totalCount: 0,
      pubDate: "",
    },
  },
};
