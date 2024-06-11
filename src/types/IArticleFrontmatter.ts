import type { CollectionEntry } from "astro:content";
import type { MarkdownInstance, Page } from "astro";

import type { StaticPost } from "@/utils/StaticPages";

export declare type ArticleFrontmatterPage = Page<
  MarkdownInstance<CollectionEntry<"posts">>
>;

export type IPost = CollectionEntry<"posts"> | StaticPost;
