import type { Meta, StoryObj } from "@storybook/react";
import { SocialLink } from ".";

const metaData: Meta = {
  title: "SocialLink",
  component: SocialLink,
};

export default metaData;

export const Default: StoryObj<typeof SocialLink> = {
  args: {
    url: "https://github.com/korosuke613",
    name: "GitHub",
    imgSrc: "/assets/images/shields_github.svg",
    height: 20,
    width: 65,
    isTop: false,
  },
};
