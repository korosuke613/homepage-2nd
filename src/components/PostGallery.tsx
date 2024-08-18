import type { IPost } from "@/types/IArticleFrontmatter";
import type { Tags } from "@/utils/Tag";

import { PostCard } from "./PostCard";

type IRecentPostsProps = {
  tags: Tags;
  contentCategory: string;
  postList: IPost[];
};

export const PostGallery = (props: IRecentPostsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {props.postList.map((elt) => (
        <PostCard
          key={elt.id}
          instance={elt}
          tags={props.tags}
          contentCategory={props.contentCategory}
        />
      ))}
    </div>
  );
};
