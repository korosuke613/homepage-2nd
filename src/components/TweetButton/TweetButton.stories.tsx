import type { Meta, StoryObj } from "@storybook/react-vite";
import { TweetButton } from ".";

const metaData: Meta = {
  title: "TweetButton",
  component: TweetButton,
};

export default metaData;

export const Default: StoryObj<typeof TweetButton> = {
  args: {
    text: "TweetButton",
    url: "https://korosuke613.dev",
  },
};
