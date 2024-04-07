import { Blogs, Posts, db, eq } from "astro:db";
import { GA4DataFetcher } from "./GA4DataFetcher";

const fetchGA4Data = async () => {
  const fetcher = new GA4DataFetcher();
  const postAnalytics = await fetcher.getPostAnalytics();
  const blogAnalytics = await fetcher.getBlogAnalytics();
  return { postAnalytics, blogAnalytics };
};

type TableType = typeof Blogs | typeof Posts;

const pushData = async <T extends TableType, U extends T["$inferSelect"]>(
  tableName: string,
  table: T,
  data: U[],
  primaryKey: keyof U,
) => {
  const currentData = await db.select().from(table);
  const diffData = GA4DataFetcher.getDiffData(
    data,
    currentData as U[],
    primaryKey,
  );
  for (const item of diffData.newItems) {
    console.log(`[${tableName}] insert: ${JSON.stringify(item)}`);
    await db.insert(table).values(item);
  }
  for (const item of diffData.updateItems) {
    console.log(`[${tableName}] update: ${JSON.stringify(item)}`);
    await db
      .update(table as TableType)
      .set(item)
      /* @ts-ignore どうやっても型を通せないので断腸の思いで ignore */
      .where(eq(table[primaryKey], primaryKey));
  }
};

export default async function seed() {
  const { postAnalytics, blogAnalytics } = await fetchGA4Data();
  console.log(JSON.stringify({ postAnalytics, blogAnalytics }, null, 2));

  await pushData("Posts", Posts, postAnalytics, "pagePath");
  await pushData("Blogs", Blogs, blogAnalytics, "linkUrl");
}
