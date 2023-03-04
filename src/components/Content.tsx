import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';
import path from 'path';
import type { ReactNode } from 'react';

import { EditGitHub } from '@/components/EditGitHub';
import { Toc } from '@/components/Toc';
import { AppConfig } from '@/utils/AppConfig';

type IContentProps = {
  content: CollectionEntry<'posts'>;
  headings: MarkdownHeading[];
  children: ReactNode;
};

const Content: React.FC<IContentProps> = (props: IContentProps) => {
  return (
    <div className="mx-auto mt-5 max-w-prose">
      {props.content.data.imgSrc && (
        <div className="aspect-w-3 aspect-h-2">
          <img
            className="h-full w-full rounded-lg object-cover object-center"
            src={path.join(AppConfig.base, props.content.data.imgSrc)}
            alt={props.content.data.imgAlt}
            loading="lazy"
          />
        </div>
      )}
      <div className="invisible fixed top-40 right-10 float-right max-w-[12%] lg:visible xl:max-w-xs">
        <Toc headings={props.headings} />
      </div>
      <div
        id="contents_data"
        className="prose prose-invert mt-8 prose-img:rounded-lg"
      >
        {props.children}
      </div>
      <br />
      <EditGitHub
        id={props.content.id}
        collection={props.content.collection}
      ></EditGitHub>
    </div>
  );
};

export { Content };
