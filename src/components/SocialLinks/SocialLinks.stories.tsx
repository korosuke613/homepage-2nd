import type { Meta, StoryObj } from "@storybook/react";
import { SocialLinks } from ".";

const metaData: Meta = {
  title: "SocialLinks",
  component: SocialLinks,
};

export default metaData;

export const All: StoryObj<typeof SocialLinks> = {
  args: {
    type: "All",
  },
};

export const Blog: StoryObj<typeof SocialLinks> = {
  args: {
    type: "Blog",
  },
};

export const Career: StoryObj<typeof SocialLinks> = {
  args: {
    type: "Career",
  },
};

export const SNS: StoryObj<typeof SocialLinks> = {
  args: {
    type: "SNS",
  },
};

export const Slide: StoryObj<typeof SocialLinks> = {
  args: {
    type: "Slide",
  },
};

export const Other: StoryObj<typeof SocialLinks> = {
  args: {
    type: "Other",
  },
};
