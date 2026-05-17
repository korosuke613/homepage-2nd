import type { CollectionEntry } from "astro:content";
import type { Page } from "astro";

import type { StaticPost } from "@/utils/StaticPages";

export type IPost = CollectionEntry<"posts"> | StaticPost;

export declare type ArticleFrontmatterPage = Page<IPost>;
