import { writeFile } from "node:fs/promises";
import { Blogs, Posts, Zenns, db, eq } from "astro:db";
import type { BatchItem } from "drizzle-orm/batch";
import { GA4DataFetcher } from "./utils/GA4DataFetcher";

const fetchGA4Data = async () => {
  const fetcher = new GA4DataFetcher();
  const postAnalytics = await fetcher.getPostAnalytics();
  const blogAnalytics = await fetcher.getBlogAnalytics();
  const zennAnalytics = await fetcher.getZennAnalytics();
  return { postAnalytics, blogAnalytics, zennAnalytics };
};

type TableType = typeof Blogs | typeof Posts | typeof Zenns;

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
  let isChange = false;
  const currentPostsData = await db.select().from(Posts);
  const currentBlogsData = await db.select().from(Blogs);
  const currentZennsData = await db.select().from(Zenns);

  // Fetch data from Google Analytics 4
  const { postAnalytics, blogAnalytics, zennAnalytics } = await fetchGA4Data();
  console.log(
    JSON.stringify({ postAnalytics, blogAnalytics, zennAnalytics }, null, 2),
  );

  // Posts
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
    isChange = true;
  } else {
    console.log("[Posts / update]: No data to update.");
  }
  if (postsQueryData.insertData.length > 0) {
    const res = await db.insert(Posts).values(postsQueryData.insertData);
    console.log(`[Posts / insert]: ${JSON.stringify(res, null, 2)}`);
    isChange = true;
  } else {
    console.log("[Posts / insert]: No data to insert.");
  }

  // Blogs
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
    isChange = true;
  } else {
    console.log("[Blogs / update]: No data to update.");
  }
  if (blogsQueryData.insertData.length > 0) {
    const res = await db.insert(Blogs).values(blogsQueryData.insertData);
    console.log(`[Blogs / insert]: ${JSON.stringify(res, null, 2)}`);
    isChange = true;
  } else {
    console.log("[Blogs / insert]: No data to insert.");
  }

  // Zenns
  const zennsQueryData = getQueryData(
    "Zenns",
    zennAnalytics,
    currentZennsData,
    "pagePath",
  );
  const zennsUpdateQuery = [];
  for (const data of zennsQueryData.updateData) {
    zennsUpdateQuery.push(
      db
        .update(Zenns)
        .set(data)
        .where(eq(Zenns.pagePath, data.pagePath))
        .returning({ updatedId: Zenns.pagePath }),
    );
  }
  if (zennsUpdateQuery.length > 0) {
    const batchRes: Array<Array<{ updatedId: string }>> = await db.batch(
      zennsUpdateQuery as unknown as [
        BatchItem<"sqlite">,
        ...BatchItem<"sqlite">[],
      ],
    );
    console.log(
      `[Zenns / update]: ${JSON.stringify(
        batchRes.flat().map((q) => q.updatedId),
        null,
        2,
      )}`,
    );
    isChange = true;
  } else {
    console.log("[Zenns / update]: No data to update.");
  }
  if (zennsQueryData.insertData.length > 0) {
    const res = await db.insert(Zenns).values(zennsQueryData.insertData);
    console.log(`[Zenns / insert]: ${JSON.stringify(res, null, 2)}`);
    isChange = true;
  } else {
    console.log("[Zenns / insert]: No data to insert.");
  }

  if (isChange) {
    await writeFile("db/isChange.txt", "true\n");
  } else {
    await writeFile("db/isChange.txt", "false\n");
  }
}
