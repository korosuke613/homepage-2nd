import type { Meta, StoryObj } from "@storybook/react";
import { EditGitHub } from ".";

const metaData: Meta = {
  title: "EditGitHub",
  component: EditGitHub,
};

export default metaData;

export const Default: StoryObj<typeof EditGitHub> = {
  args: {
    id: "history.mdx",
    collection: "posts",
  },
};
