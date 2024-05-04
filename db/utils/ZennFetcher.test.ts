import type { google } from "@google-analytics/data/build/protos/protos";
import { describe, expect, test } from "vitest";
import { ZennFetcher } from "./ZennFetcher";

const methodName = new ZennFetcher();

describe(ZennFetcher, () => {
  describe(methodName.format, () => {
    test("should return an empty array if runReportResult has no rows", () => {
      const fetcher = new ZennFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: undefined,
      };
      const result = fetcher.format(runReportResult);
      expect(result).toEqual([]);
    });

    test("should format the runReportResult into an array of ZennData objects", () => {
      const fetcher = new ZennFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/path1" }],
            metricValues: [{ value: "10" }],
          },
          {
            dimensionValues: [{ value: "/path2" }],
            metricValues: [{ value: "5" }],
          },
        ],
      };
      const result = fetcher.format(runReportResult);
      expect(result).toEqual([
        { pagePath: "/path1", screenPageViews: 10 },
        { pagePath: "/path2", screenPageViews: 5 },
      ]);
    });

    test("should ignore rows with missing dimensionValues or metricValues", () => {
      const fetcher = new ZennFetcher();
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

    test("should normalize the pagePath by removing trailing slash, #, and ?", () => {
      const fetcher = new ZennFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/path1/" }],
            metricValues: [{ value: "10" }],
          },
          {
            dimensionValues: [{ value: "/path2%23" }],
            metricValues: [{ value: "5" }],
          },
          {
            dimensionValues: [{ value: "/path1%3F" }],
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

    test("should aggregate screenPageViews for the same normalized pagePath", () => {
      const fetcher = new ZennFetcher();
      const runReportResult: google.analytics.data.v1beta.IRunReportResponse = {
        rows: [
          {
            dimensionValues: [{ value: "/path1" }],
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
