import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';
import type { ReactNode } from 'react';

import { Content } from '@/components/Content';
import { ContentHeader } from '@/components/ContentHeader';
import { Section } from '@/components/Section';
import { AppConfig } from '@/utils/AppConfig';
import type { Tags } from '@/utils/Tag';
import type { getSimilarPosts } from '@/utils/TextSimilarity';

import { SimilarityPosts } from './SimilarityPosts';

type IContentPostProps = {
  frontmatter: CollectionEntry<'posts'>;
  contentCategory: string;
  tags: Tags;
  headings: MarkdownHeading[];
  similars: ReturnType<typeof getSimilarPosts>;
  children: ReactNode;
};

export const ContentPost = (props: IContentPostProps) => {
  const tags: Tags = {};
  props.frontmatter.data.tags.forEach((t) => {
    const tagInfo = props.tags[t];
    if (tagInfo === undefined) return;
    tags[t] = tagInfo;
  });

  const maxCharWidth = 'max-w-[80ch]';

  return (
    <Section>
      <div id="contents">
        <ContentHeader
          content={props.frontmatter}
          author={AppConfig.author}
          tags={tags}
          contentCategory={props.contentCategory}
        />
        <div className={`mx-auto mt-5 ${maxCharWidth}`}>
          <Content
            headings={props.headings}
            maxCharWidth={maxCharWidth}
            content={props.frontmatter}
          >
            {props.children}
          </Content>
          <SimilarityPosts similars={props.similars} />
        </div>
      </div>
    </Section>
  );
};
