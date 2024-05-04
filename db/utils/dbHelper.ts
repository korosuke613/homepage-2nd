import { GA4DataFetcher } from "./GA4DataFetcher";

export const getQueryData = <T>(
  tableName: string,
  latestData: T[],
  currentData: T[],
  primaryKey: keyof T,
  logger: { log: (message: string) => void } = console,
): { insertData: T[]; updateData: T[] } => {
  const diffData = GA4DataFetcher.getDiffData(
    latestData,
    currentData,
    primaryKey,
  );

  const insertData: T[] = [];
  for (const item of diffData.newItems) {
    logger.log(`[${tableName}] insert: ${JSON.stringify(item)}`);
    insertData.push(item);
  }

  const updateData: T[] = [];
  for (const item of diffData.updateItems) {
    logger.log(`[${tableName}] update: ${JSON.stringify(item)}`);
    updateData.push(item);
  }

  return { insertData, updateData };
};
