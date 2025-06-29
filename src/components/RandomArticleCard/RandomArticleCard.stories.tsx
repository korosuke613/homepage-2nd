import type { IPost } from "@/types/IArticleFrontmatter";
import type { BlogData } from "@/types/IBlogPage";
import type { Meta, StoryObj } from "@storybook/react-vite";
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

// モックの記事データを作成
const samplePost: IPost = {
  id: "sample-post",
  slug: "sample-post",
  collection: "posts",
  url: "",
  data: {
    title:
      "サンプル記事タイトルサンプル記事タイトルサンプル記事タイトルサンプル記事タイトルサンプル記事タイトルサンプル記事タイトルサンプル記事タイトルサンプル記事タイトル",
    description:
      "これはサンプル記事の説明文です。記事の内容を簡潔に説明しています。",
    pubDate: new Date("2023-05-15"),
    imgSrc: "https://placehold.jp/800x450.png",
    tags: ["サンプル"],
    draft: false,
  },
};

const noImagePost: IPost = {
  id: "no-image-post",
  slug: "no-image",
  collection: "posts",
  url: "",
  data: {
    title: "画像なしの記事",
    description: "この記事には画像が設定されていません。",
    pubDate: new Date("2023-07-05"),
    tags: ["サンプル"],
    draft: false,
  },
};

const sampleBlog: BlogData = {
  id: "sample-blog",
  type: "blog",
  title: "サンプルブログ記事",
  pubDate: "2023-06-20",
  url: "https://example.com/blog/sample",
  ogpImageUrl: "https://placehold.jp/3d4070/ffffff/800x450.png",
  category: ["ブログ"],
};

const noDescriptionBlog: BlogData = {
  id: "no-description-blog",
  type: "blog",
  title: "説明なしの記事",
  pubDate: "2023-08-10",
  url: "https://example.com/blog/no-description",
  ogpImageUrl: "https://placehold.jp/30/454545/ffffff/800x450.png",
  category: ["ブログ"],
};

// 空のモックデータ
const emptyPosts: IPost[] = [];
const emptyBlogs: BlogData[] = [];

const defaultRender = (args: {
  posts: IPost[];
  blogs: BlogData[];
}) => {
  return (
    <div
      style={{
        width: "720px",
      }}
    >
      <RandomArticleCard {...args} />
    </div>
  );
};

export const Post: Story = {
  args: {
    posts: [samplePost],
    blogs: [],
  },
  parameters: {
    docs: {
      description: "ポスト記事のみを表示する例",
    },
  },
  render: defaultRender,
};

export const Blog: Story = {
  args: {
    posts: [],
    blogs: [sampleBlog],
  },
  parameters: {
    docs: {
      description: "ブログ記事のみを表示する例",
    },
  },
  render: defaultRender,
};

export const NoImage: Story = {
  args: {
    posts: [noImagePost],
    blogs: [],
  },
  parameters: {
    docs: {
      description: "画像がない記事を表示する例",
    },
  },
  render: defaultRender,
};

export const NoDescription: Story = {
  args: {
    posts: [],
    blogs: [noDescriptionBlog],
  },
  parameters: {
    docs: {
      description: "説明がない記事を表示する例",
    },
  },
  render: defaultRender,
};

export const None: Story = {
  args: {
    posts: emptyPosts,
    blogs: emptyBlogs,
  },
  parameters: {
    docs: {
      description: "記事がない場合の表示",
    },
  },
  render: defaultRender,
};

export const Multiple: Story = {
  args: {
    posts: [samplePost, noImagePost],
    blogs: [sampleBlog, noDescriptionBlog],
  },
  parameters: {
    docs: {
      description: "複数の記事からランダムに表示する例",
    },
  },
  render: defaultRender,
};
