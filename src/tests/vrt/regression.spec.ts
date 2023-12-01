import { defineConfig, test } from "@playwright/test";
import playwrightConfig from "../../../playwright-vrt.config";
import { targetPages as p } from "./testdata";
import { type Option, compare } from "./utils";

defineConfig(playwrightConfig);

test.describe.configure({ mode: "parallel" });

type TestOptions = Partial<
  Record<
    keyof typeof p,
    Option & {
      testTimeout?: number;
    }
  >
>;

const baseOptions: TestOptions = {
  dormitoryIntroduction: {
    testTimeout: 60000,
  },
};

test.describe("Visual Regression Test", () => {
  // 依存関係更新時に実行
  test.describe("update dependencies", () => {
    for (const [key, targetPage] of Object.entries(p)) {
      test(targetPage.name, async ({ page }) => {
        const timeout =
          baseOptions[key as keyof typeof p]?.testTimeout ||
          test.info().timeout;
        test.setTimeout(timeout);
        await compare(page, targetPage, baseOptions[key as keyof typeof p]);
      });
    }
  });

  // コンテンツ追加時に実行
  test.describe("add contents", () => {
    const overrideOptions: TestOptions = {
      ...baseOptions,
      index: {
        ...baseOptions.index,
        matchSnapshot: { maxDiffPixelRatio: 0.1 },
      },
      posts: {
        ...baseOptions.posts,
        matchSnapshot: { maxDiffPixelRatio: 0.4 },
      },
      dormitoryIntroduction: {
        ...baseOptions.dormitoryIntroduction,
        waitForTimeoutBeforeScreenshot: 1000,
      },
      blogs: {
        ...baseOptions.blogs,
        matchSnapshot: { maxDiffPixelRatio: 0.2 },
      },
    };

    for (const [key, targetPage] of Object.entries(p)) {
      test(targetPage.name, async ({ page }) => {
        const timeout =
          baseOptions[key as keyof typeof p]?.testTimeout ||
          test.info().timeout;
        test.setTimeout(timeout);
        await compare(page, targetPage, overrideOptions[key as keyof typeof p]);
      });
    }
  });
});
