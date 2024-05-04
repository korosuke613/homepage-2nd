import type { google } from "@google-analytics/data/build/protos/protos";
import { GA4DataFetcher } from "./GA4DataFetcher";

type BlogData = {
  linkUrl: string;
  click: number;
};

export class BlogFetcher extends GA4DataFetcher<BlogData> {
  protected override ga4Property = "properties/332682544";

  format = (
    runReportResult: google.analytics.data.v1beta.IRunReportResponse,
  ) => {
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

    return this.format(response);
  }
}
