import type { Meta, StoryObj } from "@storybook/react";
import { Title } from ".";

const metaData: Meta = {
  title: "Title",
  component: Title,
};

export default metaData;

export const Default: StoryObj<typeof Title> = {
  args: {
    preTitle: "タイトル",
    contentCategory: "posts",
  },
};
