import type { Meta, StoryObj } from "@storybook/react";
import { FooterCopyright } from "./FooterCopyright";

const metaData: Meta = {
  title: "FooterCopyright",
  component: FooterCopyright,
};

export default metaData;

export const Default: StoryObj<typeof FooterCopyright> = {
  args: {
    site_name: "Futa Hirakoba",
  },
};
