import type { IRecentBlogsProps } from "@/partials/RecentBlogs";

import { BlogCard } from "./BlogCard";

export const BlogGallery = (props: IRecentBlogsProps) => {
  // Check the existence of props since they are sometimes undefined during astro dev.
  // ref: https://github.com/withastro/astro/issues/9110
  if (props === undefined) return null;

  const { tags, viewCounts } = props;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {props.postList.map((elt) => (
        <BlogCard
          key={elt.id}
          elt={elt}
          tags={tags}
          viewCount={viewCounts[elt.url]}
        />
      ))}
    </div>
  );
};
