import type { MarkdownInstance } from 'astro';

import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';
import type { Tags } from '@/utils/Tag';

import { Project } from './Project';
import { Tag } from './Tag';

type IProjectCardProps = {
  tags: Tags;
  instance: MarkdownInstance<IProjectFrontmatter>;
};

const ProjectCard = (props: IProjectCardProps) => (
  <Project
    name={props.instance.frontmatter.title}
    description={props.instance.frontmatter.description}
    link={props.instance.url!}
    img={{
      src: props.instance.frontmatter.imgSrc,
      alt: props.instance.frontmatter.imgAlt,
    }}
    category={
      <>
        {props.instance.frontmatter.tags.map((tagName) => (
          <Tag
            key={tagName}
            name={tagName}
            color={props.tags[tagName]}
            contentCategory={'Projects'}
          />
        ))}
      </>
    }
  />
);

export { ProjectCard };
