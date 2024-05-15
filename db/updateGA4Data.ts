import { writeFile } from "node:fs/promises";
import { Blogs, Posts, Zenns, db, eq } from "astro:db";
import type { BatchItem } from "drizzle-orm/batch";
import { BlogFetcher, PostFetcher, ZennFetcher } from "./utils";
import { getQueryData } from "./utils/dbHelper";

const fetchGA4Data = async () => {
  const fetchers = {
    zenn: new ZennFetcher(),
    blog: new BlogFetcher(),
    post: new PostFetcher(),
  };

  const postAnalytics = await fetchers.post.getAnalytics();
  const blogAnalytics = await fetchers.blog.getAnalytics();
  const zennAnalytics = await fetchers.zenn.getAnalytics();
  return { postAnalytics, blogAnalytics, zennAnalytics };
};

type TableType = typeof Blogs | typeof Posts | typeof Zenns;

const updateAstroDB = async <T extends TableType>(
  table: T,
  category: string,
  latestData: T["$inferSelect"][],
  currentData: T["$inferSelect"][],
  primaryKey: keyof T["$inferSelect"],
  updateFunc: (data: T["$inferSelect"]) => void,
) => {
  let isChange = false;

  const queryData = getQueryData(category, latestData, currentData, primaryKey);
  if (queryData.updateData.length > 0) {
    const batchRes: Array<Array<{ updatedId: string }>> = await db.batch(
      queryData.updateData.map(updateFunc) as unknown as [
        BatchItem<"sqlite">,
        ...BatchItem<"sqlite">[],
      ],
    );
    console.log(
      `[${category} / update]: ${JSON.stringify(
        batchRes.flat().map((q) => q.updatedId),
        null,
        2,
      )}`,
    );
    isChange = true;
  } else {
    console.log(`[${category} / update]: No data to update.`);
  }
  if (queryData.insertData.length > 0) {
    const res = await db.insert(table).values(queryData.insertData);
    console.log(`[${category} / insert]: ${JSON.stringify(res, null, 2)}`);
    isChange = true;
  } else {
    console.log(`[${category} / insert]: No data to insert.`);
  }

  return isChange;
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
  isChange = await updateAstroDB(
    Posts,
    "Posts",
    postAnalytics,
    currentPostsData,
    "pagePath",
    (data: typeof Posts.$inferSelect) => {
      db.update(Posts)
        .set(data)
        .where(eq(Posts.pagePath, data.pagePath))
        .returning({ updatedId: Posts.pagePath });
    },
  );

  // Blogs
  isChange = await updateAstroDB(
    Blogs,
    "Blogs",
    blogAnalytics,
    currentBlogsData,
    "linkUrl",
    (data: typeof Blogs.$inferSelect) => {
      db.update(Blogs)
        .set(data)
        .where(eq(Blogs.linkUrl, data.linkUrl))
        .returning({ updatedId: Blogs.linkUrl });
    },
  );

  // Zenns
  isChange = await updateAstroDB(
    Zenns,
    "Zenns",
    zennAnalytics,
    currentZennsData,
    "pagePath",
    (data: typeof Zenns.$inferSelect) => {
      db.update(Zenns)
        .set(data)
        .where(eq(Zenns.pagePath, data.pagePath))
        .returning({ updatedId: Zenns.pagePath });
    },
  );

  if (isChange) {
    await writeFile("db/isChange.txt", "true\n");
  } else {
    await writeFile("db/isChange.txt", "false\n");
  }
}
