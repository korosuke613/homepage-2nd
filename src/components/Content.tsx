import type { MarkdownHeading } from 'astro';
import path from 'path';
import type { ReactNode } from 'react';

import { EditGitHub } from '@/components/EditGitHub';
import { Toc } from '@/components/Toc';
import type { IArticleFrontmatter } from '@/types/IArticleFrontmatter';
import { AppConfig } from '@/utils/AppConfig';

type IContentProps = {
  content: IArticleFrontmatter;
  headings: MarkdownHeading[];
  children: ReactNode;
};

const Content: React.FC<IContentProps> = (props: IContentProps) => {
  return (
    <div className="mx-auto mt-5 max-w-prose">
      {props.content.imgSrc && (
        <div className="aspect-w-3 aspect-h-2">
          <img
            className="h-full w-full rounded-lg object-cover object-center"
            src={path.join(AppConfig.base, props.content.imgSrc)}
            alt={props.content.imgAlt}
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
      <EditGitHub content={props.content}></EditGitHub>
    </div>
  );
};

export { Content };
