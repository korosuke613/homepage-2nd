import type { Meta, StoryObj } from "@storybook/react-vite";
import { SimilarityPosts } from ".";

const metaData: Meta = {
  title: "SimilarityPosts",
  component: SimilarityPosts,
};

export default metaData;

export const Default: StoryObj<typeof SimilarityPosts> = {
  args: {
    similars: [
      {
        meta: {
          url: "https://korosuke613.dev",
          urlType: "internal",
          title: "1 番目に類似度が高い内部記事",
        },
        score: 0.7,
      },
      {
        meta: {
          url: "https://korosuke613.dev",
          urlType: "internal",
          title: "2 番目に類似度が高い内部記事",
        },
        score: 0.3,
      },
      {
        meta: {
          url: "https://korosuke613.dev",
          urlType: "external",
          title: "3 番目に類似度が高い外部記事",
        },
        score: 0.1,
      },
    ],
  },
};
