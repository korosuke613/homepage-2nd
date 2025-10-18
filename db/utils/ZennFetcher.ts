import type { google } from "@google-analytics/data/build/protos/protos";
import { GA4DataFetcher } from "./GA4DataFetcher";

type ZennData = {
  pagePath: string;
  screenPageViews: number;
};

export class ZennFetcher extends GA4DataFetcher<ZennData> {
  protected override ga4Property = "properties/257999071";

  format = (
    runReportResult: google.analytics.data.v1beta.IRunReportResponse,
  ) => {
    if (!runReportResult.rows) {
      return [];
    }
    const normalizedPosts: Record<string, number> = {};

    for (const row of runReportResult.rows ?? []) {
      if (!row.dimensionValues || !row.metricValues) continue;
      if (!row.dimensionValues[0]?.value || !row.metricValues[0]?.value)
        continue;
      const pagePath = row.dimensionValues[0].value;
      const screenPageViews = Number.parseInt(row.metricValues[0].value, 10);
      // trailing slash の有無を結合する、?や#以降を丸める、正規化処理
      const normalizedUrl = pagePath
        ?.replace(/\/$/, "")
        .replace(/%23.*$/, "")
        .replace(/%3F.*$/, "");
      normalizedPosts[normalizedUrl] =
        (normalizedPosts[normalizedUrl] || 0) + screenPageViews;
    }

    const zenns = Object.entries(normalizedPosts).map(
      ([pagePath, screenPageViews]) => ({
        pagePath,
        screenPageViews,
      }),
    );

    return zenns;
  };

  public async getAnalytics() {
    const [response] = await this.client.runReport({
      property: this.ga4Property,
      dateRanges: [
        {
          startDate: "2023-09-01",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "pagePath",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
      ],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                stringFilter: {
                  matchType: "FULL_REGEXP",
                  value: "^(/cybozu_ept/|/korosuke613/).*$",
                },
                fieldName: "pagePath",
              },
            },
          ],
        },
      },
    });

    return this.format(response);
  }
}
