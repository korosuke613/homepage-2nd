import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { google } from "@google-analytics/data/build/protos/protos";

export abstract class GA4DataFetcher<T> {
  protected abstract readonly ga4Property: string;
  protected readonly client: BetaAnalyticsDataClient;

  constructor(config?: {
    client?: BetaAnalyticsDataClient;
  }) {
    this.client = config?.client ?? new BetaAnalyticsDataClient();
  }

  abstract format(
    runReportResult: google.analytics.data.v1beta.IRunReportResponse,
  ): T[];

  abstract getAnalytics(): Promise<T[]>;

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
