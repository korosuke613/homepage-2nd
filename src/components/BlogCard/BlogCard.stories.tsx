import type { GlobalArgs } from ".storybook/preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogCard } from "./index";

const metaData: Meta<typeof BlogCard> = {
  title: "BlogCard",
  component: BlogCard,
};

export default metaData;

const baseElt = {
  id: "1",
  type: "type",
  title:
    "成果物のハッシュ値を保存・比較して余計なデプロイを行わないようにする for GitHub Actions",
  url: "https://zenn.dev/cybozu_ept/articles/skip-deploy-by-artifact-sha-for-github-actions",
  pubDate: "2021-01-01",
  category: ["Zenn", "hoge"],
  ogpImageUrl:
    "https://res.cloudinary.com/zenn/image/upload/s--qc8hn0Qc--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E6%2588%2590%25E6%259E%259C%25E7%2589%25A9%25E3%2581%25AE%25E3%2583%258F%25E3%2583%2583%25E3%2582%25B7%25E3%2583%25A5%25E5%2580%25A4%25E3%2582%2592%25E4%25BF%259D%25E5%25AD%2598%25E3%2583%25BB%25E6%25AF%2594%25E8%25BC%2583%25E3%2581%2597%25E3%2581%25A6%25E4%25BD%2599%25E8%25A8%2588%25E3%2581%25AA%25E3%2583%2587%25E3%2583%2597%25E3%2583%25AD%25E3%2582%25A4%25E3%2582%2592%25E8%25A1%258C%25E3%2582%258F%25E3%2581%25AA%25E3%2581%2584%25E3%2582%2588%25E3%2581%2586%25E3%2581%25AB%25E3%2581%2599%25E3%2582%258B%2520for%2520GitHub%2520Actions%2Cw_1010%2Cx_90%2Cy_100/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2582%25B5%25E3%2582%25A4%25E3%2583%259C%25E3%2582%25A6%25E3%2582%25BA%2520%25E7%2594%259F%25E7%2594%25A3%25E6%2580%25A7%25E5%2590%2591%25E4%25B8%258A%25E3%2583%2581%25E3%2583%25BC%25E3%2583%25A0%2520%2520%2Cx_220%2Cy_160/g_south_west%2Cl_text:notosansjp-medium.otf_34:Futa%2520Hirakoba%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3plbm4tdXNlci11cGxvYWQvYXZhdGFyL2I0ZGFiZjEwMjAuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3plbm4tdXNlci11cGxvYWQvYXZhdGFyLzdjOTZjZGNlNTguanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png",
};

const baseTags = {
  Zenn: "bg-slate-400 text-slate-900",
  hoge: "bg-red-400 text-slate-900",
};

export const LongTitle: StoryObj<typeof BlogCard> = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  args: {
    elt: {
      ...baseElt,
      title:
        "成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値成果物のハッシュ値",
    },
    tags: baseTags,
  },
  render: (args) => {
    return (
      <div
        style={{
          width: "320px",
        }}
      >
        <BlogCard elt={args.elt} tags={args.tags} viewCount={args.viewCount} />
      </div>
    );
  },
};

export const WithViewCount: StoryObj<typeof BlogCard> = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  args: {
    elt: {
      ...baseElt,
    },
    viewCount: 10000,
    tags: baseTags,
  },
  render: (args) => {
    return (
      <div
        style={{
          width: "320px",
        }}
      >
        <BlogCard elt={args.elt} tags={args.tags} viewCount={args.viewCount} />
      </div>
    );
  },
};

export const Default: StoryObj<typeof BlogCard> = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  args: {
    elt: { ...baseElt, title: "成果物のハッシュ値" },
    tags: baseTags,
  },
  render: (args) => {
    return (
      <div
        style={{
          width: "320px",
        }}
      >
        <BlogCard elt={args.elt} tags={args.tags} viewCount={args.viewCount} />
      </div>
    );
  },
};

export const SmallMobile: StoryObj<typeof BlogCard & GlobalArgs> = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    elt: { ...baseElt, title: "成果物のハッシュ値" },
    viewCount: 10000,
    tags: baseTags,
    Global_disableDecorator: true,
  },
};

export const LargeMobile: StoryObj<typeof BlogCard & GlobalArgs> = {
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
  args: {
    elt: { ...baseElt, title: "成果物のハッシュ値" },
    viewCount: 10000,
    tags: baseTags,
    Global_disableDecorator: true,
  },
};
