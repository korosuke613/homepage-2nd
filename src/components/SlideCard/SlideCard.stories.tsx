import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlideCard } from ".";

const metaData: Meta<typeof SlideCard> = {
  title: "SlideCard",
  component: SlideCard,
};

export default metaData;

export const Default: StoryObj<typeof SlideCard> = {
  args: {
    elt: {
      id: "sample-slide-001",
      type: "docswell",
      title: "サンプルスライド: Astroで作る高速Webサイト",
      pubDate: "2024-01-15",
      url: "https://example.com/slides/sample",
      thumbnailUrl: "/assets/images/zenn_scrap.webp",
      category: ["Astro", "フロントエンド"],
    },
    tags: {
      Astro: "bg-orange-500 text-white",
      フロントエンド: "bg-blue-500 text-white",
    },
  },
};

export const WithoutThumbnail: StoryObj<typeof SlideCard> = {
  args: {
    elt: {
      id: "sample-slide-002",
      type: "speakerdeck",
      title: "サムネイルなしのスライド例",
      pubDate: "2024-02-20",
      url: "https://example.com/slides/no-thumbnail",
      category: ["React", "TypeScript"],
    },
    tags: {
      React: "bg-cyan-500 text-white",
      TypeScript: "bg-blue-600 text-white",
    },
  },
};

export const LongTitle: StoryObj<typeof SlideCard> = {
  args: {
    elt: {
      id: "sample-slide-003",
      type: "slideshare",
      title:
        "非常に長いタイトルのスライド例：パフォーマンス最適化とアクセシビリティを考慮した大規模Webアプリケーション開発のベストプラクティス",
      pubDate: "2024-03-10",
      url: "https://example.com/slides/long-title",
      thumbnailUrl: "/assets/images/zenn_scrap.webp",
      category: ["パフォーマンス", "アクセシビリティ"],
    },
    tags: {
      パフォーマンス: "bg-green-500 text-white",
      アクセシビリティ: "bg-purple-500 text-white",
    },
  },
};
