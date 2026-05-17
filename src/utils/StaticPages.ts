import type { CollectionEntry } from "astro:content";
import { AppConfig } from "./AppConfig";
import { joinPaths } from "./PathUtils";

export type StaticPost = {
  data: CollectionEntry<"posts">["data"];
  collection: string;
  id: string;
  url: string;
};

export const DormitoryIntroduction: StaticPost = {
  collection: "posts",
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
  url: joinPaths(AppConfig.base, "posts", "dormitory_introduction"), // src/pages からの相対パス
};

export const History: StaticPost = {
  collection: "posts",
  id: "history",
  data: {
    title: "自己紹介",
    description: "平木場ヒストリー",
    pubDate: new Date("2022-08-21T00:00:00Z"),
    order: 0,
    tags: ["Pickup ⭐️", "ポエム"],
    draft: false,
  },
  url: joinPaths(AppConfig.base, "posts", "history"), // src/pages からの相対パス
};

export const Ranking: StaticPost = {
  collection: "posts",
  id: "ranking",
  data: {
    title: "人気記事 👑",
    description: "本ホームページの人気記事一覧です。",
    pubDate: new Date("2024-04-07T00:00:00Z"),
    order: 5,
    tags: ["Pickup ⭐️"],
    draft: false,
  },
  url: joinPaths(AppConfig.base, "posts", "ranking"), // src/pages からの相対パス
};

export const StaticPages = [History, DormitoryIntroduction, Ranking];
