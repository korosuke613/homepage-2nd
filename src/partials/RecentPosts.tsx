import type { MarkdownInstance } from 'astro';

import { GradientText } from '@/components/GradientText';
import { PostGallery } from '@/components/PostGallery';
import { Section } from '@/components/Section';
import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';
import type { Tags } from '@/utils/Tag';

type IRecentPostsProps = {
  tags: Tags;
  postList: MarkdownInstance<IProjectFrontmatter>[];
};

const RecentPosts = (props: IRecentPostsProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Posts</GradientText>
        </div>

        <div className="text-sm">
          <a href="/posts">View all Posts →</a>
        </div>
      </div>
    }
  >
    <PostGallery postList={props.postList} tags={props.tags} />
  </Section>
);

export { RecentPosts };
