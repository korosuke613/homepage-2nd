import path from "node:path";
import type { Page, TestInfo } from "playwright/test";
import { defineConfig, expect } from "playwright/test";

const waitImagesLoaded = async (page: Page) => {
  const locators = page.locator("img");
  for (const locator of await locators.all()) {
    await locator.evaluate((e) => e.scrollIntoView());
    await locator.evaluate(
      (image: HTMLImageElement) =>
        image.complete ||
        new Promise((resolve) => image.addEventListener("load", resolve)),
      { timeout: 60000 },
    );
  }
};

export type Option = {
  matchSnapshot?: {
    maxDiffPixels?: number;
    maxDiffPixelRatio?: number;
    threshold?: number;
  };
  waitForTimeoutBeforeScreenshot?: number;
  reload?: boolean;
  baseUrl?: string;
};

export type TargetPage = { name: string; path: string };

export const init = async (
  page: Page,
  testInfo: TestInfo,
  targetPage: TargetPage,
  option?: Option,
) => {
  const fileName = `${targetPage.name}.png`;
  const url = path.join(
    option?.baseUrl || "https://korosuke613.dev/",
    targetPage.path,
  );

  defineConfig({
    updateSnapshots: "all",
  });
  await page.goto(url, {
    waitUntil: "networkidle",
  });
  await page.waitForLoadState("networkidle");
  await waitImagesLoaded(page);
  await page.screenshot({
    fullPage: true,
    path: path.join(testInfo.project.snapshotDir, "snapshots", fileName),
    mask: [page.locator('h3:has-text("編集履歴")').locator("..")],
  });
};

export const compare = async (
  page: Page,
  targetPage: TargetPage,
  option?: Option,
) => {
  const fileName = `${targetPage.name}.png`;
  const url = path.join(option?.baseUrl || "localhost:4321", targetPage.path);

  defineConfig({
    updateSnapshots: "missing",
  });
  await page.goto(url, {
    waitUntil: "networkidle",
  });
  await page.waitForLoadState("networkidle");

  if (option?.reload) {
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForLoadState("networkidle");
  }

  await waitImagesLoaded(page);
  if (option?.waitForTimeoutBeforeScreenshot)
    await page.waitForTimeout(option.waitForTimeoutBeforeScreenshot);

  expect(
    await page.screenshot({
      fullPage: true,
      mask: [page.locator('h3:has-text("編集履歴")').locator("..")],
    }),
  ).toMatchSnapshot(fileName, {
    maxDiffPixelRatio: 0.02,
    ...option?.matchSnapshot,
  });
};
