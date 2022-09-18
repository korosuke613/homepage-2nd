import type { IContent } from '@/types/IArticleFrontmatter';
import type { Tags } from '@/utils/Tag';

import { PostCard } from './PostCard';

type IRecentPostsProps = {
  tags: Tags;
  contentCategory: string;
  postList: IContent[];
};

export const PostGallery = (props: IRecentPostsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.postList.map((elt) => (
        <PostCard
          key={elt.url}
          instance={elt}
          tags={props.tags}
          contentCategory={props.contentCategory}
        />
      ))}
    </div>
  );
};
