import type { GlobalArgs } from ".storybook/preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { MarkdownHeading } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { ContentHeader } from ".";

const metaData: Meta = {
  title: "ContentHeader",
  component: ContentHeader,
};

export default metaData;

export const Default: StoryObj<typeof ContentHeader & GlobalArgs> = {
  args: {
    content: {
      id: "20170930_etrobocon2017.md",
      collection: "posts",
      slug: "20170930_etrobocon2017",
      body: "body",
      data: {
        title: "ETロボコン2017",
        pubDate: new Date("2017-09-30"),
        imgSrc: "/assets/images/etrobocon2017.png",
        tags: ["ETロボコン"],
      },
      render: undefined as unknown as () => Promise<{
        Content: AstroComponentFactory;
        headings: MarkdownHeading[];
        remarkPluginFrontmatter: Record<string, unknown>;
      }>,
    },
    Global_disableDecorator: true,
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
    author: "Futa Hirakoba",
  },
};
