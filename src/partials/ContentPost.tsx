import type { ReactNode } from 'react';

import { Content } from '@/components/Content';
import { ContentHeader } from '@/components/ContentHeader';
import { Section } from '@/components/Section';
import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';
import { AppConfig } from '@/utils/AppConfig';
import { generateTags } from '@/utils/Tag';

type IContentPostProps = {
  frontmatter: IProjectFrontmatter;
  contentCategory: string;
  children: ReactNode;
};

export const ContentPost = (props: IContentPostProps) => {
  const tags = generateTags(props.frontmatter.tags);

  return (
    <Section>
      <ContentHeader
        content={props.frontmatter}
        author={AppConfig.author}
        tags={tags}
        contentCategory={props.contentCategory}
      />

      <Content content={props.frontmatter}>{props.children}</Content>
    </Section>
  );
};
