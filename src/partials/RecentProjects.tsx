import type { MarkdownInstance } from 'astro';

import { GradientText } from '@/components/GradientText';
import { PostGallery } from '@/components/PostGallery';
import { Section } from '@/components/Section';
import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';
import type { Tags } from '@/utils/Tag';

type IRecentProjectsProps = {
  tags: Tags;
  postList: MarkdownInstance<IProjectFrontmatter>[];
};

export const RecentProjects = (props: IRecentProjectsProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Projects</GradientText>
        </div>

        <div className="text-sm">
          <a href="projects">View all Projects →</a>
        </div>
      </div>
    }
  >
    <PostGallery
      postList={props.postList}
      tags={props.tags}
      contentCategory={'Projects'}
    />
  </Section>
);
