import path from "path";
import type { MarkdownHeading } from "astro";
import type { ReactNode } from "react";
import type { CollectionEntry } from "astro:content";

import { EditGitHub } from "@/components/EditGitHub";
import { Toc } from "@/components/Toc";
import { TweetButton } from "@/components/TweetButton";
import { AppConfig } from "@/utils/AppConfig";

type IContentProps = {
  content: CollectionEntry<"posts">;
  headings: MarkdownHeading[];
  maxCharWidth: string;
  children: ReactNode;
};

const Content: React.FC<IContentProps> = (props: IContentProps) => {
  const contentUrl = new URL(
    `${props.content.collection}/${props.content.slug}`,
    `https://${AppConfig.publish_domain}`,
  ).href;

  return (
    <div>
      {props.content.data.imgSrc && (
        <div className="aspect-h-2 aspect-w-3">
          <img
            className="h-full w-full rounded-lg object-cover object-center"
            src={path.join(AppConfig.base, props.content.data.imgSrc)}
            alt={props.content.data.imgAlt}
            loading="lazy"
          />
        </div>
      )}
      <div className="invisible fixed right-10 top-40 float-right max-w-[12%] lg:visible xl:max-w-xs">
        <Toc headings={props.headings} />
      </div>
      <div
        id="contents_data"
        className={`prose prose-invert mt-8 ${props.maxCharWidth} prose-img:rounded-lg`}
      >
        {props.children}
      </div>
      <br />
      <div className="flex flex-wrap justify-end gap-2">
        <TweetButton text={props.content.data.title} url={contentUrl} />
        <EditGitHub
          id={props.content.id}
          collection={props.content.collection}
        />
      </div>
    </div>
  );
};

export { Content };
