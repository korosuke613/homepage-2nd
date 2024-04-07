import { Blogs, Playground, Posts, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Playground).values([
    { number: 1, text: "Hope you like Astro DB!" },
    { number: 2, text: "a", date: new Date("2024/03/03") },
    { number: 3, text: "dummy", json: { key: "value" } },
    { number: 4, text: "dummy", boolean: true },
    { number: 5, text: "dummy" },
    { number: 6, text: "dummy" },
    { number: 7, text: "dummy" },
    { number: 8, text: "dummy" },
    { number: 9, text: "dummy" },
    { number: 10, text: "dummy" },
  ]);

  await db.insert(Posts).values([
    { pagePath: "/post/hello-world", screenPageViews: 100 },
    { pagePath: "/post/another-post", screenPageViews: 200 },
    { pagePath: "/post/last-post", screenPageViews: 300 },
  ]);

  await db.insert(Blogs).values([
    { linkUrl: "https://example.com/hoge", click: 100 },
    { linkUrl: "https://example.com/foo", click: 200 },
    { linkUrl: "https://example.com/bar", click: 300 },
  ]);
}
