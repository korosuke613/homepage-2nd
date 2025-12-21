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

/**
 * 編集履歴セクションをDOMから非表示にする
 * 編集履歴はgit履歴から動的生成されるため、本番とPR環境で高さが異なる
 * maskでは高さの違いを吸収できないため、セクション自体を非表示にする
 */
const hideCommitHistory = async (page: Page) => {
  await page.evaluate(() => {
    const headings = document.querySelectorAll("h3");
    for (const heading of headings) {
      if (heading.textContent?.includes("編集履歴")) {
        const container = heading.parentElement;
        if (container) {
          container.style.display = "none";
        }
        break;
      }
    }
  });
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
  await hideCommitHistory(page);
  await page.screenshot({
    fullPage: true,
    path: path.join(testInfo.project.snapshotDir, "snapshots", fileName),
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

  await hideCommitHistory(page);
  expect(
    await page.screenshot({
      fullPage: true,
    }),
  ).toMatchSnapshot(fileName, {
    maxDiffPixelRatio: 0.02,
    ...option?.matchSnapshot,
  });
};
