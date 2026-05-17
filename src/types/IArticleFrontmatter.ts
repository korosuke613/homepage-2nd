import type { CollectionEntry } from "astro:content";
import type { Page } from "astro";

import type { StaticPost } from "@/utils/StaticPages";

export declare type ArticleFrontmatterPage = Page<CollectionEntry<"posts">>;

export type IPost = CollectionEntry<"posts"> | StaticPost;
