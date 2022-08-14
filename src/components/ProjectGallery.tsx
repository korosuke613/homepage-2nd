import type { MarkdownInstance } from 'astro';

import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';
import type { Tags } from '@/utils/Tag';

import { ProjectCard } from './ProjectCard';

type IRecentPostsProps = {
  tags: Tags;
  postList: MarkdownInstance<IProjectFrontmatter>[];
};

export const ProjectGallery = (props: IRecentPostsProps) => (
  <div className="flex flex-col gap-6">
    {props.postList.map((elt) => (
      <ProjectCard key={elt.url} instance={elt} tags={props.tags} />
    ))}
  </div>
);
