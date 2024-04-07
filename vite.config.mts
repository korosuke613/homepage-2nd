import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["default", "junit"],
    outputFile: {
      junit: new URL("./test-results/unit.xml", import.meta.url).pathname,
    },
    include: ["src/tests/unit/**/*.{test,spec}.ts", "db/**/*.{test,spec}.ts"],
    cache: {
      dir: new URL("./.cache/.vitest", import.meta.url).pathname,
    },
    coverage: {
      all: true,
      include: ["src/utils/*.{js,ts}", "db/utils/*.ts"],
      exclude: ["src/tests/**", "src/**/*.stories.tsx", "src/types/**"],
      reporter: ["text", "cobertura"],
      reportsDirectory: new URL("./coverage/unit", import.meta.url).pathname,
    },
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
