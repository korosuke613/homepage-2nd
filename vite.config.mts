import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  cacheDir: new URL("./.cache/.vitest", import.meta.url).pathname,
  optimizeDeps: {
    include: ["react/jsx-dev-runtime"],
    exclude: ["markdown-to-jsx"],
  },
  test: {
    reporters: ["default", "junit"],
    outputFile: {
      junit: new URL("./test-results/unit.xml", import.meta.url).pathname,
    },
    exclude: ["src/tests/e2e/**", "src/tests/vrt/**"],
    coverage: {
      all: true,
      include: [
        "src/utils/*.{js,ts}",
        "src/components/**/*.{js,ts,tsx}",
        "db/utils/*.ts",
      ],
      exclude: ["src/tests/**", "src/**/*.stories.tsx", "src/types/**"],
      reporter: ["text", "cobertura"],
      reportsDirectory: new URL("./coverage/unit", import.meta.url).pathname,
    },
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          isolate: false,
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
            screenshotFailures: false,
          },
          setupFiles: [".storybook/vitest.setup.ts"],
          testTimeout: 30000,
          hookTimeout: 30000,
        },
      },
      {
        test: {
          name: "unit",
          environment: "node",
          include: [
            "src/tests/unit/**/*.{test,spec}.ts",
            "db/**/*.{test,spec}.ts",
          ],
        },
        resolve: {
          alias: {
            "@/": new URL("./src/", import.meta.url).pathname,
          },
        },
      },
    ],
  },
});
