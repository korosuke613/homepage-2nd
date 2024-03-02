import type { Meta, StoryObj } from "@storybook/react";
import type { MarkdownHeading } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { PostCard } from "./index";

const metaData: Meta<typeof PostCard> = {
  title: "PostCard",
  component: PostCard,
  render: (args) => {
    return (
      <div
        style={{
          width: "320px",
        }}
      >
        <PostCard {...args} />
      </div>
    );
  },
};

export default metaData;

export const Default: StoryObj<typeof PostCard> = {
  args: {
    instance: {
      id: "20170930_etrobocon2017.md",
      collection: "posts",
      slug: "20170930_etrobocon2017",
      body: "body",
      data: {
        title: "ETロボコン2017",
        pubDate: new Date("2017-09-30"),
        imgSrc: "assets/images/cover/etrobo_2018_yokohama.webp",
        tags: ["ETロボコン"],
      },
      render: undefined as unknown as () => Promise<{
        Content: AstroComponentFactory;
        headings: MarkdownHeading[];
        remarkPluginFrontmatter: Record<string, unknown>;
      }>,
    },
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
  },
};

export const LongTitle: StoryObj<typeof PostCard> = {
  args: {
    instance: {
      id: "20170930_etrobocon2017.md",
      collection: "posts",
      slug: "20170930_etrobocon2017",
      body: "body",
      data: {
        title:
          "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロ",
        pubDate: new Date("2017-09-30"),
        imgSrc: "assets/images/cover/etrobo_2018_yokohama.webp",
        tags: ["ETロボコン"],
      },
      render: undefined as unknown as () => Promise<{
        Content: AstroComponentFactory;
        headings: MarkdownHeading[];
        remarkPluginFrontmatter: Record<string, unknown>;
      }>,
    },
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
  },
};
