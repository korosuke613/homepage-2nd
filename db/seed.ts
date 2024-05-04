import { Blogs, Playground, Posts, Zenns, db } from "astro:db";

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
    { pagePath: "/posts/20190330_intern", screenPageViews: 100 },
    { pagePath: "/posts/20200401_join_cybozu", screenPageViews: 200 },
    { pagePath: "/posts/20231001_put_tweet_button", screenPageViews: 300 },
  ]);

  await db.insert(Blogs).values([
    {
      linkUrl:
        "https://zenn.dev/cybozu_ept/articles/productivity-weekly-20240306",
      click: 400,
    },
    {
      linkUrl:
        "https://zenn.dev/cybozu_ept/articles/productivity-weekly-20240214",
      click: 500,
    },
    {
      linkUrl:
        "https://zenn.dev/cybozu_ept/articles/practice-vrt-using-github-actions-cache",
      click: 600,
    },
  ]);

  await db.insert(Zenns).values([
    {
      pagePath: "/korosuke613/scraps/703218980ddc5d",
      screenPageViews: 460,
    },
    {
      pagePath: "/korosuke613/scraps/c801cb634bb42c",
      screenPageViews: 459,
    },
    {
      pagePath: "/cybozu_ept/articles/productivity-weekly-20230927",
      screenPageViews: 449,
    },
  ]);
}
