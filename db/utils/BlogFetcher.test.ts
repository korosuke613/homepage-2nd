import { describe, expect, test } from "vitest";

import type { google } from "@google-analytics/data/build/protos/protos";
import { BlogFetcher } from "./BlogFetcher";

const methodName = new BlogFetcher();

describe(BlogFetcher, () => {
  describe(methodName.format, () => {
    test("should return an empty array if runReportResult.rows is falsy", () => {
      const blogFetcher = new BlogFetcher();
      const runReportResult = { rows: null };
      const result = blogFetcher.format(runReportResult);
      expect(result).toEqual([]);
    });

    test("should return an array of external links with their click count", () => {
      const blogFetcher = new BlogFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "https://example.com" }],
            metricValues: [{ value: "10" }],
          },
          {
            dimensionValues: [{ value: "https://example.org" }],
            metricValues: [{ value: "5" }],
          },
        ],
      };
      const result = blogFetcher.format(runReportResult);
      expect(result).toEqual([
        { linkUrl: "https://example.com", click: 10 },
        { linkUrl: "https://example.org", click: 5 },
      ]);
    });

    test("should ignore rows with missing dimensionValues or metricValues", () => {
      const fetcher = new BlogFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/path1" }],
            metricValues: undefined,
          },
          {
            dimensionValues: undefined,
            metricValues: [{ value: "5" }],
          },
        ],
      };
      const result = fetcher.format(runReportResult);
      expect(result).toEqual([]);
    });
  });
});
