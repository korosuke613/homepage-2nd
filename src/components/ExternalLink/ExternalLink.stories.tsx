import type { Meta, StoryObj } from "@storybook/react";
import { ExternalLink } from ".";

const metaData: Meta = {
  title: "ExternalLink",
  component: ExternalLink,
};

export default metaData;

export const Text: StoryObj<typeof ExternalLink> = {
  args: {
    url: "https://korosuke613.dev",
    title: "korosuke613.dev",
  },
};

export const ReactNode: StoryObj<typeof ExternalLink> = {
  args: {
    url: "https://korosuke613.dev",
    title: <img src="/assets/images/my_icon_2.png" alt="icon" />,
  },
};
