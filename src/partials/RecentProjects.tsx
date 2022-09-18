import path from 'path';

import { GradientText } from '@/components/GradientText';
import { PostGallery } from '@/components/PostGallery';
import { Section } from '@/components/Section';
import type { IContent } from '@/types/IArticleFrontmatter';
import { AppConfig } from '@/utils/AppConfig';
import type { Tags } from '@/utils/Tag';

type IRecentProjectsProps = {
  tags: Tags;
  postList: IContent[];
};

export const RecentProjects = (props: IRecentProjectsProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          <GradientText>Projects</GradientText>
        </div>

        <div className="text-sm">
          <a href={path.join(AppConfig.base, 'posts', 'tag', 'Projects')}>
            View all Projects →
          </a>
        </div>
      </div>
    }
  >
    <PostGallery
      postList={props.postList}
      tags={props.tags}
      contentCategory="Posts"
    />
  </Section>
);
