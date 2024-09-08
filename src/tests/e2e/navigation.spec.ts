import { expect, test } from "@playwright/test";

test.describe("posts", async () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (!testInfo.project.use.baseURL) {
      throw new Error("baseURL is not defined.");
    }

    await page.goto("posts");
  });

  test("click tag", async ({ page }) => {
    const expectPagePath = "/posts/tag/OSS";

    // テキストに `OSS` が入ってかつ `.contents_tag` をクリックする
    await page.getByRole("link", { name: "OSS" }).first().click();
    await page.waitForURL(expectPagePath);
    await page.waitForLoadState("networkidle");

    expect(page).toHaveURL(expectPagePath);
  });

  test("click year", async ({ page }) => {
    const expectPagePath = "/posts/year/2022";

    // テキストに `2022` が入ってかつ `.contents_year` をクリックする
    await page.getByRole("link", { name: "2022" }).first().click();
    await page.waitForURL(expectPagePath);
    await page.waitForLoadState("networkidle");

    expect(page).toHaveURL(expectPagePath);
  });
});

test.describe("blogs", async () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (!testInfo.project.use.baseURL) {
      throw new Error("baseURL is not defined.");
    }

    await page.goto("blogs");
  });

  test("click tag", async ({ page }) => {
    const expectPagePath = "/blogs/tag/Zenn";

    // テキストに `Zenn` が入ってかつ `.contents_tag` をクリックする
    await page.getByRole("link", { name: "Zenn" }).first().click();
    await page.waitForURL(expectPagePath);
    await page.waitForLoadState("networkidle");

    expect(page).toHaveURL(expectPagePath);
  });

  test("click year", async ({ page }) => {
    const expectPagePath = "/blogs/year/2022";

    // テキストに `2022` が入ってかつ `.contents_year` をクリックする
    await page.getByRole("link", { name: "2022" }).first().click();
    await page.waitForURL(expectPagePath);
    await page.waitForLoadState("networkidle");

    expect(page).toHaveURL(expectPagePath);
  });
});
