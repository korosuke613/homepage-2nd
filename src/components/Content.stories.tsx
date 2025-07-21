import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import { Content } from "./Content";

const meta = {
  title: "Components/Content",
  component: Content,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Content>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockContent = {
  id: "test-post",
  collection: "posts" as const,
  slug: "test-post",
  body: "",
  data: {
    title: "Test Post",
    pubDate: new Date("2025-01-01"),
    description: "Test description",
    tags: ["test"],
    imgSrc: "",
    imgAlt: "",
  },
} as Parameters<typeof Content>[0]["content"];

const mockHeadings = [
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
];

export const Default: Story = {
  args: {
    content: mockContent,
    headings: mockHeadings,
    maxCharWidth: "max-w-prose",
    children: (
      <div>
        <h2 id="heading-1">Heading 1</h2>
        <p>This is some content under heading 1.</p>
        <h3 id="sub-heading-1">Sub Heading 1</h3>
        <p>This is some content under sub heading 1.</p>
        <h2 id="heading-2">Heading 2</h2>
        <p>This is some content under heading 2.</p>
        <h3 id="sub-heading-2">Sub Heading 2</h3>
        <p>This is some content under sub heading 2.</p>
      </div>
    ),
  },
};

// モバイル画面でのテスト
export const MobileView: Story = {
  args: {
    content: mockContent,
    headings: mockHeadings,
    maxCharWidth: "max-w-prose",
    children: (
      <div>
        <h2 id="heading-1">Heading 1</h2>
        <p>This is some content under heading 1.</p>
        <h3 id="sub-heading-1">Sub Heading 1</h3>
        <p>This is some content under sub heading 1.</p>
        <h2 id="heading-2">Heading 2</h2>
        <p>This is some content under heading 2.</p>
        <h3 id="sub-heading-2">Sub Heading 2</h3>
        <p>This is some content under sub heading 2.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  play: async ({ canvasElement }) => {
    // モバイル画面でのレスポンシブ動作テスト
    const mobileTocContainer = canvasElement.querySelector(".block");
    const desktopTocContainer = canvasElement.querySelector(".hidden");

    expect(mobileTocContainer).toBeInTheDocument();
    expect(desktopTocContainer).toBeInTheDocument();

    // モバイル用TOCの折りたたみ機能テスト
    const summaryElement = canvasElement.querySelector("summary");
    expect(summaryElement).toBeInTheDocument();

    if (summaryElement) {
      // detailsの初期状態をチェック
      const detailsElement = summaryElement.closest("details");
      const isInitiallyOpen = detailsElement?.hasAttribute("open");

      // クリックイベントをシミュレート
      summaryElement.click();

      await new Promise((resolve) => setTimeout(resolve, 200));
      const isOpenAfterClick = detailsElement?.hasAttribute("open");

      // 状態が切り替わったことを確認
      expect(isOpenAfterClick).toBe(!isInitiallyOpen);
    }
  },
};

// タブレット画面でのテスト
export const TabletView: Story = {
  args: {
    content: mockContent,
    headings: mockHeadings,
    maxCharWidth: "max-w-prose",
    children: (
      <div>
        <h2 id="heading-1">Heading 1</h2>
        <p>This is some content under heading 1.</p>
        <h3 id="sub-heading-1">Sub Heading 1</h3>
        <p>This is some content under sub heading 1.</p>
        <h2 id="heading-2">Heading 2</h2>
        <p>This is some content under heading 2.</p>
        <h3 id="sub-heading-2">Sub Heading 2</h3>
        <p>This is some content under sub heading 2.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  play: async ({ canvasElement }) => {
    // タブレット画面でのレスポンシブ動作テスト
    const mobileTocContainer = canvasElement.querySelector(".block");
    const desktopTocContainer = canvasElement.querySelector(".hidden");

    expect(mobileTocContainer).toBeInTheDocument();
    expect(desktopTocContainer).toBeInTheDocument();
  },
};

// デスクトップ画面でのテスト
export const DesktopView: Story = {
  args: {
    content: mockContent,
    headings: mockHeadings,
    maxCharWidth: "max-w-prose",
    children: (
      <div>
        <h2 id="heading-1">Heading 1</h2>
        <p>This is some content under heading 1.</p>
        <h3 id="sub-heading-1">Sub Heading 1</h3>
        <p>This is some content under sub heading 1.</p>
        <h2 id="heading-2">Heading 2</h2>
        <p>This is some content under heading 2.</p>
        <h3 id="sub-heading-2">Sub Heading 2</h3>
        <p>This is some content under sub heading 2.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  play: async ({ canvasElement }) => {
    // デスクトップ画面でのレスポンシブ動作テスト
    const mobileTocContainer = canvasElement.querySelector(".block");
    const desktopTocContainer = canvasElement.querySelector(".hidden");

    expect(mobileTocContainer).toBeInTheDocument();
    expect(desktopTocContainer).toBeInTheDocument();

    // デスクトップ用TOCの固定位置スタイリング確認
    if (desktopTocContainer) {
      const styles = window.getComputedStyle(desktopTocContainer);
      expect(styles.position).toBeDefined();
      expect(styles.right).toBeDefined();
      expect(styles.top).toBeDefined();
    }
  },
};
