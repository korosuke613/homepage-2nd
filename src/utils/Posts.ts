import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';

export const sortByDate = (
  posts: Array<{ frontmatter: IProjectFrontmatter }>
) => {
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.pubDate).valueOf() -
      new Date(a.frontmatter.pubDate).valueOf()
  );
};

export const sortByOrder = (
  posts: Array<{ frontmatter: IProjectFrontmatter }>
) => {
  return posts.sort((a, b) => {
    let aDate = new Date(a.frontmatter.pubDate).valueOf();
    let bDate = new Date(b.frontmatter.pubDate).valueOf();
    if (a.frontmatter.order !== undefined) {
      aDate = Number.MAX_SAFE_INTEGER - a.frontmatter.order;
    }
    if (b.frontmatter.order !== undefined) {
      bDate = Number.MAX_SAFE_INTEGER - b.frontmatter.order;
    }

    return bDate - aDate;
  });
};
