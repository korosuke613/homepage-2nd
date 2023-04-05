import type { CollectionEntry } from 'astro:content';
import natural from 'natural';

export const listSimilarities = <T>(
  base: string,
  search: { meta: T; content: string }[]
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
  collections: CollectionEntry<'posts'>[]
) => {
  const list = collections
    .map((c) => ({
      meta: c,
      content: `${c.data.title}\n\n${c.data.tags.join(' ')}\n\n${c.body}`,
    }))
    .filter((c) => c.meta.slug !== base.slug);
  return listSimilarities(
    `${base.data.title}\n\n${base.data.tags.join(' ')}\n\n${base.body}`,
    list
  );
};
