import { expect, test } from "@playwright/experimental-ct-react";
import { Content } from "@/components/Content";

// テストデータ
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

const mockContent = {
  id: "test-post",
  collection: "posts",
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
};

// モバイル画面（375px）でのテスト
test.describe("TOC on mobile screens (375px)", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should display inline MobileToc and hide desktop Toc", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <Content content={mockContent} headings={mockHeadings} maxCharWidth="max-w-prose">
          <p>Test content</p>
        </Content>
      </div>,
    );

    // モバイル用目次が表示されていることを確認
    const mobileTocContainer = component.locator("div.block.lg\\:hidden");
    await expect(mobileTocContainer).toBeVisible();
    
    // モバイル用目次内の要素を確認
    const mobileTocSummary = mobileTocContainer.locator("summary");
    await expect(mobileTocSummary).toBeVisible();
    await expect(mobileTocSummary).toContainText("目次");

    // デスクトップ用目次が非表示であることを確認
    const desktopTocContainer = component.locator("div.hidden.lg\\:block");
    await expect(desktopTocContainer).not.toBeVisible();
  });
});

// タブレット画面（768px）でのテスト
test.describe("TOC on tablet screens (768px)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("should display inline MobileToc and hide desktop Toc", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <Content content={mockContent} headings={mockHeadings} maxCharWidth="max-w-prose">
          <p>Test content</p>
        </Content>
      </div>,
    );

    // モバイル用目次が表示されていることを確認
    const mobileTocContainer = component.locator("div.block.lg\\:hidden");
    await expect(mobileTocContainer).toBeVisible();
    
    // モバイル用目次内の要素を確認
    const mobileTocSummary = mobileTocContainer.locator("summary");
    await expect(mobileTocSummary).toBeVisible();

    // デスクトップ用目次が非表示であることを確認
    const desktopTocContainer = component.locator("div.hidden.lg\\:block");
    await expect(desktopTocContainer).not.toBeVisible();
  });
});

// デスクトップ画面（1024px）でのテスト
test.describe("TOC on desktop screens (1024px)", () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test("should hide MobileToc and display fixed desktop Toc", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <Content content={mockContent} headings={mockHeadings} maxCharWidth="max-w-prose">
          <p>Test content</p>
        </Content>
      </div>,
    );

    // モバイル用目次が非表示であることを確認
    const mobileTocContainer = component.locator("div.block.lg\\:hidden");
    await expect(mobileTocContainer).not.toBeVisible();

    // デスクトップ用目次が表示されていることを確認
    const desktopTocContainer = component.locator("div.hidden.lg\\:block");
    await expect(desktopTocContainer).toBeVisible();
    
    // デスクトップ用目次のスタイリングを確認
    await expect(desktopTocContainer).toHaveClass(/lg:fixed/);
    await expect(desktopTocContainer).toHaveClass(/lg:right-4/);
    await expect(desktopTocContainer).toHaveClass(/lg:top-40/);
    await expect(desktopTocContainer).toHaveClass(/lg:max-w-\[200px\]/);
    await expect(desktopTocContainer).toHaveClass(/lg:z-10/);
  });
});

// 大画面デスクトップ（1280px）でのテスト
test.describe("TOC on large desktop screens (1280px)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("should hide MobileToc and display fixed desktop Toc with xl styles", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <Content content={mockContent} headings={mockHeadings} maxCharWidth="max-w-prose">
          <p>Test content</p>
        </Content>
      </div>,
    );

    // モバイル用目次が非表示であることを確認
    const mobileTocContainer = component.locator("div.block.lg\\:hidden");
    await expect(mobileTocContainer).not.toBeVisible();

    // デスクトップ用目次が表示されていることを確認
    const desktopTocContainer = component.locator("div.hidden.lg\\:block");
    await expect(desktopTocContainer).toBeVisible();
    
    // xlブレークポイント用のスタイリングを確認
    await expect(desktopTocContainer).toHaveClass(/xl:right-10/);
    await expect(desktopTocContainer).toHaveClass(/xl:max-w-xs/);
  });
});
