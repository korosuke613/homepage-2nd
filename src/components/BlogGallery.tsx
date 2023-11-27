import type { IRecentBlogsProps } from "@/partials/RecentBlogs";

import { BlogCard } from "./BlogCard";

export const BlogGallery = (props: IRecentBlogsProps) => {
  // Check the existence of props since they are sometimes undefined during astro dev.
  // ref: https://github.com/withastro/astro/issues/9110
  if (props === undefined) return <></>;

  const { tags } = props;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.postList.map((elt) => (
        <BlogCard elt={elt} tags={tags} />
      ))}
    </div>
  );
};
