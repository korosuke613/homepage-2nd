import type { IRecentBlogsProps } from '@/partials/RecentBlogs';

import { BlogCard } from './BlogCard';

export const BlogGallery = (props: IRecentBlogsProps) => {
  if (props.tags === undefined) {
    throw new Error('Tags are required');
  }
  const { tags } = props;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.postList.map((elt) => (
        <BlogCard elt={elt} tags={tags} />
      ))}
    </div>
  );
};
