import type { MarkdownInstance, Page } from "astro";
import type { CollectionEntry } from "astro:content";

import type { StaticPost } from "@/utils/StaticPages";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export declare type ArticleFrontmatterPage = Page<
  MarkdownInstance<CollectionEntry<"posts">>
>;

export type IPost = CollectionEntry<"posts"> | StaticPost;
