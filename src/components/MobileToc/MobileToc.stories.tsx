import type { Meta, StoryObj } from "@storybook/react";
import { MobileToc } from "./index";

const meta = {
  title: "Components/MobileToc",
  component: MobileToc,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MobileToc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headings: [
      {
        depth: 2,
        slug: "heading-1",
        text: "Heading 1",
      },
      {
        depth: 3,
        slug: "sub-heading-1",
        text: "Sub Heading 1",
      },
      {
        depth: 2,
        slug: "heading-2",
        text: "Heading 2",
      },
      {
        depth: 3,
        slug: "sub-heading-2",
        text: "Sub Heading 2",
      },
      {
        depth: 3,
        slug: "sub-heading-3",
        text: "Sub Heading 3",
      },
      {
        depth: 2,
        slug: "heading-3",
        text: "Heading 3",
      },
    ],
  },
};

export const LongHeadings: Story = {
  args: {
    headings: [
      {
        depth: 2,
        slug: "very-long-heading-that-might-wrap-to-multiple-lines",
        text: "Very Long Heading That Might Wrap To Multiple Lines And Need Special Handling",
      },
      {
        depth: 3,
        slug: "another-long-sub-heading-for-testing-purposes",
        text: "Another Long Sub Heading For Testing Purposes And Edge Cases",
      },
      {
        depth: 2,
        slug: "heading-2",
        text: "Heading 2",
      },
    ],
  },
};

export const NoHeadings: Story = {
  args: {
    headings: [],
  },
};
