import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
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

// Play関数を使ったインタラクションテスト（基本的な実装）
export const InteractionTest: Story = {
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
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 基本的なDOM操作のテスト
    const summaryElement = canvasElement.querySelector("summary");
    expect(summaryElement).toBeInTheDocument();

    if (summaryElement) {
      // 初期状態の確認
      const detailsElement = summaryElement.closest("details");
      expect(detailsElement).toBeInTheDocument();
      const isInitiallyOpen = detailsElement?.hasAttribute("open");

      // クリックイベントをシミュレート
      summaryElement.click();

      // クリック後の状態確認
      await new Promise((resolve) => setTimeout(resolve, 200));
      const isOpenAfterClick = detailsElement?.hasAttribute("open");
      expect(isOpenAfterClick).toBe(!isInitiallyOpen);

      // 目次項目の確認
      const headingLinks = canvas.getAllByRole("link");
      expect(headingLinks.length).toBeGreaterThan(0);

      // 再度クリックして折りたたみ
      summaryElement.click();

      await new Promise((resolve) => setTimeout(resolve, 200));
      const isFinallyOpen = detailsElement?.hasAttribute("open");
      expect(isFinallyOpen).toBe(isInitiallyOpen);
    }
  },
};
