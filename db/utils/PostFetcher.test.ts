import type { google } from "@google-analytics/data/build/protos/protos";
import { describe, expect, test } from "vitest";
import { PostFetcher } from "./PostFetcher";

const methodName = new PostFetcher();

describe(PostFetcher, () => {
  describe(methodName.format, () => {
    test("should handle empty runReportResult", () => {
      const postFetcher = new PostFetcher();
      const runReportResult = {
        rows: [],
      };

      const formattedPosts = postFetcher.format(runReportResult);

      expect(formattedPosts).toEqual([]);
    });

    test("should format the runReportResult correctly", () => {
      const postFetcher = new PostFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/posts/1" }],
            metricValues: [{ value: "10" }],
          },
          {
            dimensionValues: [{ value: "/posts/2" }],
            metricValues: [{ value: "5" }],
          },
          {
            dimensionValues: [{ value: "/blogs/1" }],
            metricValues: [{ value: "3" }],
          },
        ],
      };

      const expectedPosts = [
        { pagePath: "/posts/1", screenPageViews: 10 },
        { pagePath: "/posts/2", screenPageViews: 5 },
        { pagePath: "/blogs/1", screenPageViews: 3 },
      ];

      const formattedPosts = postFetcher.format(runReportResult);

      expect(formattedPosts).toEqual(expectedPosts);
    });

    test("should handle missing dimensionValues or metricValues", () => {
      const postFetcher = new PostFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/posts/1" }],
            metricValues: [],
          },
          {
            dimensionValues: [],
            metricValues: [{ value: "5" }],
          },
        ],
      };

      const formattedPosts = postFetcher.format(runReportResult);

      expect(formattedPosts).toEqual([]);
    });

    test("should normalize the pagePath by removing trailing slash, #, and ?", () => {
      const fetcher = new PostFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/path1/" }],
            metricValues: [{ value: "10" }],
          },
          {
            dimensionValues: [{ value: "/path2" }],
            metricValues: [{ value: "5" }],
          },
          {
            dimensionValues: [{ value: "/path1" }],
            metricValues: [{ value: "3" }],
          },
        ],
      };
      const result = fetcher.format(runReportResult);
      expect(result).toEqual([
        { pagePath: "/path1", screenPageViews: 13 },
        { pagePath: "/path2", screenPageViews: 5 },
      ]);
    });
  });
});
