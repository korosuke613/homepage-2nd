/* eslint-disable import/no-extraneous-dependencies */
import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  reporter: [["list"], ["junit", { outputFile: "test-results/vrt.xml" }]],
  testDir: "src/tests/vrt",
  snapshotPathTemplate: "{snapshotDir}/{testFileDir}/snapshots/{arg}{ext}",
  webServer: {
    command: "npm run dev",
    port: 4321,
    reuseExistingServer: !process.env.CI,
    env: {
      IS_TESTING: "true",
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          ignoreDefaultArgs: ["--headless"],
          args: ["--headless=new"],
        },
        // launchOptions: {
        //   headless: false,
        // },
      },
    },
  ],
};

export default config;
