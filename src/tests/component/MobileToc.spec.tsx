import { expect, test } from "@playwright/experimental-ct-react";
import { MobileToc } from "@/components/MobileToc";

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

// モバイル画面サイズでテスト
test.describe("MobileToc on mobile screens", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should render correctly with headings", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <MobileToc headings={mockHeadings} />
      </div>,
    );

    // 目次が存在することを確認
    const summary = component.locator("summary");
    await expect(summary).toBeVisible();
    await expect(summary).toContainText("目次");

    // 初期状態では折りたたまれていることを確認
    const detailsContent = component.locator("details > div");
    await expect(detailsContent).not.toBeVisible();
  });

  test("should toggle visibility when clicked", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <MobileToc headings={mockHeadings} />
      </div>,
    );

    // 目次ボタンをクリック
    const summary = component.locator("summary");
    await summary.click();

    // 目次が表示されることを確認
    const detailsContent = component.locator("details > div");
    await expect(detailsContent).toBeVisible();

    // 目次項目が正しく表示されていることを確認
    const headingItems = component.locator("li a");
    await expect(headingItems).toHaveCount(4);
    await expect(headingItems.nth(0)).toContainText("Heading 1");
    await expect(headingItems.nth(1)).toContainText("Sub Heading 1");

    // 再度クリックで折りたたまれることを確認
    await summary.click();
    await expect(detailsContent).not.toBeVisible();
  });

  test("should navigate to anchor when heading is clicked", async ({ mount, page }) => {
    const component = await mount(
      <div className="text-gray-100">
        <MobileToc headings={mockHeadings} />
      </div>,
    );

    // 目次ボタンをクリック
    const summary = component.locator("summary");
    await summary.click();

    // 目次項目が表示されることを確認
    const detailsContent = component.locator("details > div");
    await expect(detailsContent).toBeVisible();

    // 最初の目次項目のhref属性を確認
    const firstHeadingLink = component.locator("li a").first();
    await expect(firstHeadingLink).toHaveAttribute("href", "#heading-1");
  });

  test("should not render anything when no headings are provided", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <MobileToc headings={[]} />
      </div>,
    );

    // 目次が表示されないことを確認
    const summary = component.locator("summary");
    await expect(summary).toHaveCount(0);
  });

  test("should style headings differently based on depth", async ({ mount }) => {
    const component = await mount(
      <div className="text-gray-100">
        <MobileToc headings={mockHeadings} />
      </div>,
    );

    // 目次ボタンをクリック
    const summary = component.locator("summary");
    await summary.click();

    // 深さ2の見出しが太字でスタイリングされていることを確認
    const firstHeadingLink = component.locator("li a").first();
    await expect(firstHeadingLink).toHaveClass(/font-bold/);

    // 深さ3の見出しが通常のフォントでスタイリングされていることを確認
    const subHeadingLink = component.locator("li a").nth(1);
    await expect(subHeadingLink).toHaveClass(/font-normal/);
  });
});
