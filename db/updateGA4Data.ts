import { Blogs, Posts, db, eq } from "astro:db";
import type { BatchItem } from "drizzle-orm/batch";
import { GA4DataFetcher } from "./GA4DataFetcher";

const fetchGA4Data = async () => {
  const fetcher = new GA4DataFetcher();
  const postAnalytics = await fetcher.getPostAnalytics();
  const blogAnalytics = await fetcher.getBlogAnalytics();
  return { postAnalytics, blogAnalytics };
};

type TableType = typeof Blogs | typeof Posts;

const getQueryData = <T extends TableType["$inferSelect"]>(
  tableName: string,
  latestData: T[],
  currentData: T[],
  primaryKey: keyof T,
): { insertData: T[]; updateData: T[] } => {
  const diffData = GA4DataFetcher.getDiffData(
    latestData,
    currentData,
    primaryKey,
  );

  const insertData: T[] = [];
  for (const item of diffData.newItems) {
    console.log(`[${tableName}] insert: ${JSON.stringify(item)}`);
    insertData.push(item);
  }

  const updateData: T[] = [];
  for (const item of diffData.updateItems) {
    console.log(`[${tableName}] update: ${JSON.stringify(item)}`);
    updateData.push(item);
  }

  return { insertData, updateData };
};

export default async function () {
  const currentPostsData = await db.select().from(Posts);
  const currentBlogsData = await db.select().from(Blogs);

  const { postAnalytics, blogAnalytics } = await fetchGA4Data();
  console.log(JSON.stringify({ postAnalytics, blogAnalytics }, null, 2));

  const postsQueryData = getQueryData(
    "Posts",
    postAnalytics,
    currentPostsData,
    "pagePath",
  );
  const postsUpdateQuery = [];
  for (const data of postsQueryData.updateData) {
    postsUpdateQuery.push(
      db
        .update(Posts)
        .set(data)
        .where(eq(Posts.pagePath, data.pagePath))
        .returning({ updatedId: Posts.pagePath }),
    );
  }
  if (postsUpdateQuery.length > 0) {
    const batchRes: Array<Array<{ updatedId: string }>> = await db.batch(
      postsUpdateQuery as unknown as [
        BatchItem<"sqlite">,
        ...BatchItem<"sqlite">[],
      ],
    );
    console.log(
      `[Posts / update]: ${JSON.stringify(
        batchRes.flat().map((q) => q.updatedId),
        null,
        2,
      )}`,
    );
  }
  if (postsQueryData.insertData.length > 0) {
    const res = await db.insert(Posts).values(postsQueryData.insertData);
    console.log(`[Posts / insert]: ${JSON.stringify(res, null, 2)}`);
  }

  const blogsQueryData = getQueryData(
    "Blogs",
    blogAnalytics,
    currentBlogsData,
    "linkUrl",
  );
  const blogsUpdateQuery = [];
  for (const data of blogsQueryData.updateData) {
    blogsUpdateQuery.push(
      db
        .update(Blogs)
        .set(data)
        .where(eq(Blogs.linkUrl, data.linkUrl))
        .returning({ updatedId: Blogs.linkUrl }),
    );
  }
  if (blogsUpdateQuery.length > 0) {
    const batchRes: Array<Array<{ updatedId: string }>> = await db.batch(
      blogsUpdateQuery as unknown as [
        BatchItem<"sqlite">,
        ...BatchItem<"sqlite">[],
      ],
    );
    console.log(
      `[Blogs / update]: ${JSON.stringify(
        batchRes.flat().map((q) => q.updatedId),
        null,
        2,
      )}`,
    );
  }
  if (blogsQueryData.insertData.length > 0) {
    const res = await db.insert(Blogs).values(blogsQueryData.insertData);
    console.log(`[Blogs / insert]: ${JSON.stringify(res, null, 2)}`);
  }
}
