import type { GlobalArgs } from ".storybook/preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IPost } from "@/types/IArticleFrontmatter";
import { PostCard } from "./index";

const metaData: Meta<typeof PostCard> = {
  title: "PostCard",
  component: PostCard,
};

export default metaData;

const mockInstance = {
  id: "20170930_etrobocon2017",
  collection: "posts",
  data: {
    title: "ETロボコン2017",
    pubDate: new Date("2017-09-30"),
    imgSrc: "assets/images/cover/etrobo_2018_yokohama.webp",
    tags: ["ETロボコン"],
  },
} as unknown as IPost;

export const Default: StoryObj<typeof PostCard> = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  args: {
    instance: mockInstance,
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
  },
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

export const LongTitle: StoryObj<typeof PostCard> = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  args: {
    instance: {
      id: "20170930_etrobocon2017",
      collection: "posts",
      data: {
        title:
          "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロ",
        pubDate: new Date("2017-09-30"),
        imgSrc: "assets/images/cover/etrobo_2018_yokohama.webp",
        tags: ["ETロボコン"],
      },
    } as unknown as IPost,
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
  },
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

export const SmallMobile: StoryObj<typeof PostCard & GlobalArgs> = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    instance: mockInstance,
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
    Global_disableDecorator: true,
  },
};

export const LargeMobile: StoryObj<typeof PostCard & GlobalArgs> = {
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
  args: {
    instance: mockInstance,
    tags: {
      ETロボコン: "bg-slate-400 text-slate-900",
    },
    contentCategory: "posts",
    Global_disableDecorator: true,
  },
};
