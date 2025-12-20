import type { CollectionEntry } from "astro:content";
import path from "node:path";
import type { MarkdownHeading } from "astro";
import type { ReactNode } from "react";

import { EditGitHub } from "@/components/EditGitHub";
import { MobileToc } from "@/components/MobileToc";
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
      {/* モバイル・タブレット用インライン目次 */}
      <div className="block lg:hidden mb-4 mt-4">
        <MobileToc headings={props.headings} />
      </div>

      {/* デスクトップ用固定目次 */}
      <div className="hidden lg:block lg:fixed lg:right-4 lg:top-40 lg:max-w-[200px] lg:z-10 xl:right-10 xl:max-w-xs">
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
          fileId={props.content.id}
          collection={props.content.collection}
        />
      </div>
    </div>
  );
};

export { Content };
