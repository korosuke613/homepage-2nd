import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { google } from "@google-analytics/data/build/protos/protos";

type BlogData = {
  linkUrl: string;
  click: number;
};

type PostData = {
  pagePath: string;
  screenPageViews: number;
};

export class GA4DataFetcher {
  GA4_PROPERTY_ID = "properties/332682544";
  client: BetaAnalyticsDataClient;

  constructor() {
    this.client = new BetaAnalyticsDataClient();
  }

  formatBlogAnalytics = (
    runReportResult: google.analytics.data.v1beta.IRunReportResponse,
  ): BlogData[] => {
    if (!runReportResult.rows) {
      return [];
    }
    const externalLinks = runReportResult.rows
      .map((row) => {
        if (!row.dimensionValues || !row.metricValues)
          return { linkUrl: "", click: 0 };
        if (!row.dimensionValues[0]?.value || !row.metricValues[0]?.value)
          return { linkUrl: "", click: 0 };
        return {
          linkUrl: row.dimensionValues[0].value,
          click: Number.parseInt(row.metricValues[0].value),
        };
      })
      .filter(({ linkUrl }) => linkUrl.startsWith("https://"));

    return externalLinks;
  };

  public async getBlogAnalytics(): Promise<BlogData[]> {
    const [response] = await this.client.runReport({
      property: this.GA4_PROPERTY_ID,
      dateRanges: [
        {
          startDate: "2023-09-01",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "linkUrl",
        },
        {
          name: "eventName",
        },
      ],
      metrics: [
        {
          name: "eventCount",
        },
      ],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                stringFilter: {
                  matchType: "FULL_REGEXP",
                  value:
                    "^(https://zenn.dev/|https://korosuke613.hatenablog.com/).*$",
                },
                fieldName: "linkUrl",
              },
            },
            {
              filter: {
                fieldName: "eventName",
                stringFilter: {
                  value: "click",
                },
              },
            },
          ],
        },
      },
    });

    return this.formatBlogAnalytics(response);
  }

  formatPostAnalytics = (
    runReportResult: google.analytics.data.v1beta.IRunReportResponse,
  ): PostData[] => {
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

  public async getPostAnalytics() {
    const [response] = await this.client.runReport({
      property: this.GA4_PROPERTY_ID,
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

    return this.formatPostAnalytics(response);
  }

  public static getDiffData = <T>(
    latest: T[],
    current: T[],
    primaryKey: keyof T,
  ) => {
    const updateItems: T[] = [];
    const newItems: T[] = [];

    for (const latestItem of latest) {
      const currentItem = current.find(
        (p) => p[primaryKey] === latestItem[primaryKey],
      );
      if (!currentItem) {
        newItems.push(latestItem);
        continue;
      }

      const isDiff = JSON.stringify(latestItem) !== JSON.stringify(currentItem);
      if (isDiff) {
        updateItems.push(latestItem);
      }
    }

    return { updateItems, newItems };
  };
}
