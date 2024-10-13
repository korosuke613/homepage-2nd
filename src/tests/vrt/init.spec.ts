import { defineConfig, test } from "@playwright/test";
import playwrightConfig from "../../../playwright-vrt.config";
import { targetPages as p } from "./testdata";
import { init } from "./utils";

defineConfig(playwrightConfig);

test.describe.configure({ mode: "parallel" });

test.describe("Init Visual Regression Test", () => {
  for (const targetPage of Object.values(p)) {
    test(targetPage.name, async ({ page }, testInfo) =>
      await init(page, testInfo, targetPage));
  }
});
