import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';
import type { ReactNode } from 'react';

import { Content } from '@/components/Content';
import { ContentHeader } from '@/components/ContentHeader';
import { Section } from '@/components/Section';
import { AppConfig } from '@/utils/AppConfig';
import type { Tags } from '@/utils/Tag';

type IContentPostProps = {
  frontmatter: CollectionEntry<'posts'>;
  contentCategory: string;
  tags: Tags;
  headings: MarkdownHeading[];
  children: ReactNode;
};

export const ContentPost = (props: IContentPostProps) => {
  const tags: Tags = {};
  props.frontmatter.data.tags.forEach((t) => {
    const tagInfo = props.tags[t];
    if (tagInfo === undefined) return;
    tags[t] = tagInfo;
  });

  return (
    <Section>
      <div id="contents">
        <ContentHeader
          content={props.frontmatter}
          author={AppConfig.author}
          tags={tags}
          contentCategory={props.contentCategory}
        />
        <Content headings={props.headings} content={props.frontmatter}>
          {props.children}
        </Content>
      </div>
    </Section>
  );
};
