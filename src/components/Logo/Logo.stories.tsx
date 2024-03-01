import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from ".";

const metaData: Meta = {
  title: "Logo",
  component: Logo,
};

export default metaData;

export const Text: StoryObj<typeof Logo> = {
  args: {
    name: "name",
    icon: "💪",
  },
};

export const ReactNode: StoryObj<typeof Logo> = {
  args: {
    name: "name",
    icon: <img src="/assets/images/my_icon_2.png" alt="icon" />,
  },
};
