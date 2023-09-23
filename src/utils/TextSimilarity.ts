import natural from "natural";
import type { CollectionEntry } from "astro:content";

import hatena from "@/../public/assets/hatena_blog.json";

export const listSimilarities = <T>(
  base: string,
  search: { meta: T; content: string }[],
) => {
  const searched = search.map((s) => {
    // const rawScore = leven(s.content, base);
    const score = natural.JaroWinklerDistance(s.content, base, {
      ignoreCase: false,
    });
    return {
      meta: s.meta,
      score,
    };
  });

  const result = searched.sort((a, b) => (a.score > b.score ? -1 : 1));

  return result;
};

export const getSimilarPosts = (
  base: { slug: string; data: { title: string; tags: string[] }; body: string },
  collections: CollectionEntry<"posts">[],
) => {
  const unionBase = `${base.data.title}\n\n${base.data.tags.join(" ")}\n\n${
    base.body
  }`;

  type Meta = {
    url: string;
    urlType: "internal" | "external";
    title: string;
  };
  type List = { meta: Meta; content: string }[];

  const postList: List = collections
    .filter((c) => c.slug !== base.slug)
    .map((c) => ({
      meta: {
        url: `/${c.collection}/${c.slug}`,
        urlType: "internal",
        title: c.data.title.replaceAll("\\n", ""),
      },
      content: `${c.data.title}\n\n${c.data.tags.join(" ")}\n\n${c.body}`,
    }));

  const hatenaList: List = Object.values(hatena.articles).map((a) => {
    return {
      meta: {
        url: a.link,
        urlType: "external",
        title: a.title,
      },
      content: `${a.title}\n\n${a.category.join(" ")}\n\n`,
    };
  });

  const list = listSimilarities(unionBase, [...postList, ...hatenaList]);

  return list;
};
