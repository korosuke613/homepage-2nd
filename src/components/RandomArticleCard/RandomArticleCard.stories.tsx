import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IPost } from "@/types/IArticleFrontmatter";
import type { BlogData } from "@/types/IBlogPage";
import type { SlideData } from "@/types/ISlide";
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

const sampleSlide: SlideData = {
  id: "sample-slide",
  type: "docswell",
  title: "サンプルスライド発表",
  pubDate: "2023-09-10",
  url: "https://example.com/slides/sample",
  thumbnailUrl: "https://placehold.jp/ff6600/ffffff/800x450.png",
  category: ["Docswell"],
};

const noThumbnailSlide: SlideData = {
  id: "no-thumbnail-slide",
  type: "speakerdeck",
  title: "サムネイルなしのスライド",
  pubDate: "2023-10-01",
  url: "https://example.com/slides/no-thumbnail",
  category: ["SpeakerDeck"],
};

// 空のモックデータ
const emptyPosts: IPost[] = [];
const emptyBlogs: BlogData[] = [];
const emptySlides: SlideData[] = [];

const defaultRender = (args: {
  posts: IPost[];
  blogs: BlogData[];
  slides: SlideData[];
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
    slides: [],
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
    slides: [],
  },
  parameters: {
    docs: {
      description: "ブログ記事のみを表示する例",
    },
  },
  render: defaultRender,
};

export const Slide: Story = {
  args: {
    posts: [],
    blogs: [],
    slides: [sampleSlide],
  },
  parameters: {
    docs: {
      description: "スライドのみを表示する例",
    },
  },
  render: defaultRender,
};

export const NoImage: Story = {
  args: {
    posts: [noImagePost],
    blogs: [],
    slides: [],
  },
  parameters: {
    docs: {
      description: "画像がない記事を表示する例",
    },
  },
  render: defaultRender,
};

export const NoThumbnail: Story = {
  args: {
    posts: [],
    blogs: [],
    slides: [noThumbnailSlide],
  },
  parameters: {
    docs: {
      description: "サムネイルがないスライドを表示する例",
    },
  },
  render: defaultRender,
};

export const NoDescription: Story = {
  args: {
    posts: [],
    blogs: [noDescriptionBlog],
    slides: [],
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
    slides: emptySlides,
  },
  parameters: {
    docs: {
      description: "コンテンツがない場合の表示",
    },
  },
  render: defaultRender,
};

export const Multiple: Story = {
  args: {
    posts: [samplePost, noImagePost],
    blogs: [sampleBlog, noDescriptionBlog],
    slides: [sampleSlide, noThumbnailSlide],
  },
  parameters: {
    docs: {
      description: "複数のコンテンツからランダムに表示する例",
    },
    chromatic: { disableSnapshot: true },
  },
  render: defaultRender,
};
