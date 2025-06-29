import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationHeader } from ".";
import type { GlobalArgs } from ".storybook/preview";

const metaData: Meta<typeof PaginationHeader> & GlobalArgs = {
  title: "PaginationHeader",
  component: PaginationHeader,
  args: {
    Global_disableDecorator: true,
  },
};

export default metaData;

export const Default: StoryObj<typeof PaginationHeader> = {
  args: {
    title: "Blog",
    description: "外部のブログ記事（自動更新）",
  },
};
