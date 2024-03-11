import path from "node:path";
import type { CollectionEntry } from "astro:content";
import { AppConfig } from "./AppConfig";

export type StaticPost = {
  data: CollectionEntry<"posts">["data"];
  collection: string;
  id: string;
  slug: string;
  url: string;
};

export const DormitoryIntroduction: StaticPost = {
  collection: "posts",
  slug: "dormitory_introduction",
  id: "dormitory_introduction",
  data: {
    title: "宮崎大学国際交流宿舎の紹介（２０１７年版）",
    description: "宮崎大学の寮の一つ、国際交流宿舎を紹介するページです。",
    pubDate: new Date("2017-08-21T00:00:00Z"),
    order: 4,
    imgSrc: "/assets/images/cover/dormitory.webp",
    imgAlt: "string",
    tags: ["Pickup ⭐️", "大学"],
    draft: false,
  },
  url: path.join(AppConfig.base, "posts", "dormitory_introduction"), // src/pages からの相対パス
};
