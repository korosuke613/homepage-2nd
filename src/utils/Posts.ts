import type { IPost } from "@/types/IArticleFrontmatter";

export const sortByDate = (posts: IPost[]) => {
  return posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
  );
};

export const sortByOrder = (posts: IPost[]) => {
  return posts.sort((a, b) => {
    let aDate = new Date(a.data.pubDate).valueOf();
    let bDate = new Date(b.data.pubDate).valueOf();
    if (a.data.order !== undefined) {
      aDate = Number.MAX_SAFE_INTEGER - a.data.order;
    }
    if (b.data.order !== undefined) {
      bDate = Number.MAX_SAFE_INTEGER - b.data.order;
    }

    return bDate - aDate;
  });
};

export const getGitHubUrl = (
  githubUrl: string,
  collection: string,
  id: string,
) => {
  if (id === "dormitory_introduction") {
    // 国際交流宿舎の紹介はパスが異なるので特別扱い
    return `https://${githubUrl}/blob/main/src/pages/posts/dormitory_introduction.astro`;
  }

  const baseUrl = `https://${githubUrl}/tree/main/src/content/`;
  const url = new URL(
    `${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
    baseUrl,
  );

  return url.toString();
};
