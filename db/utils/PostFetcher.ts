import type { google } from "@google-analytics/data/build/protos/protos";
import { GA4DataFetcher } from "./GA4DataFetcher";

type PostData = {
  pagePath: string;
  screenPageViews: number;
};

export class PostFetcher extends GA4DataFetcher<PostData> {
  protected override ga4Property = "properties/332682544";

  format = (
    runReportResult: google.analytics.data.v1beta.IRunReportResponse,
  ) => {
    // trailing slash の有無を結合する正規化処理
    const normalizedPosts: Record<string, number> = {};
    for (const row of runReportResult.rows ?? []) {
      if (!row.dimensionValues || !row.metricValues) continue;
      if (!row.dimensionValues[0]?.value || !row.metricValues[0]?.value)
        continue;
      const pagePath = row.dimensionValues[0].value;
      const screenPageViews = Number.parseInt(row.metricValues[0].value);
      const normalizedUrl = pagePath?.replace(/\/$/, "");
      normalizedPosts[normalizedUrl] =
        (normalizedPosts[normalizedUrl] || 0) + screenPageViews;
    }

    const posts = Object.entries(normalizedPosts).map(
      ([pagePath, screenPageViews]) => ({
        pagePath,
        screenPageViews,
      }),
    );

    return posts;
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
        notExpression: {
          orGroup: {
            expressions: [
              {
                filter: {
                  stringFilter: {
                    matchType: "FULL_REGEXP",
                    value: "^/(posts|blogs)/year/.*$",
                  },
                  fieldName: "pagePath",
                },
              },
              {
                filter: {
                  stringFilter: {
                    matchType: "FULL_REGEXP",
                    value: "^/(posts|blogs)/\\d+/?.*$",
                  },
                  fieldName: "pagePath",
                },
              },
              {
                filter: {
                  stringFilter: {
                    matchType: "FULL_REGEXP",
                    value: "^/(posts|blogs)/tag/.*$",
                  },
                  fieldName: "pagePath",
                },
              },
              {
                filter: {
                  stringFilter: {
                    matchType: "FULL_REGEXP",
                    value: "^/(posts|blogs)/?$",
                  },
                  fieldName: "pagePath",
                },
              },
              {
                filter: {
                  stringFilter: {
                    matchType: "FULL_REGEXP",
                    value: "^/$",
                  },
                  fieldName: "pagePath",
                },
              },
            ],
          },
        },
      },
    });

    return this.format(response);
  }
}
