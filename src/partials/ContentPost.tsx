import type { MarkdownHeading } from "astro";
import type { ReactNode } from "react";
import type { CollectionEntry } from "astro:content";

import { CommitHistoryPost } from "@/components/CommitHistoryPost";
import { Content } from "@/components/Content";
import { ContentHeader } from "@/components/ContentHeader";
import { Section } from "@/components/Section";
import { SimilarityPosts } from "@/components/SimilarityPosts";
import { AppConfig } from "@/utils/AppConfig";
import type { CommitHistory } from "@/utils/CommitHistories";
import type { Tags } from "@/utils/Tag";
import type { getSimilarPosts } from "@/utils/TextSimilarity";

type IContentPostProps = {
  frontmatter: CollectionEntry<"posts">;
  contentCategory: string;
  tags: Tags;
  headings: MarkdownHeading[];
  similars: ReturnType<typeof getSimilarPosts>;
  histories: CommitHistory[];
  children: ReactNode;
};

export const ContentPost = (props: IContentPostProps) => {
  const tags: Tags = {};
  for (const t of props.frontmatter.data.tags) {
    const tagInfo = props.tags[t];
    if (tagInfo === undefined) continue;
    tags[t] = tagInfo;
  }

  const maxCharWidth = "max-w-[80ch]";

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
          <hr className="my-10" />
          <CommitHistoryPost
            collection={props.frontmatter.collection}
            id={props.frontmatter.id}
            histories={props.histories}
          />
          <br />
          <SimilarityPosts similars={props.similars} />
        </div>
      </div>
    </Section>
  );
};
