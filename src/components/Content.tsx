import type { ReactNode } from 'react';

import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';

type IContentProps = {
  content: IProjectFrontmatter;
  children: ReactNode;
};

const Content: React.FC<IContentProps> = (props: IContentProps) => {
  return (
    <div className="mx-auto mt-5 max-w-prose">
      {props.content.imgSrc && (
        <div className="aspect-w-3 aspect-h-2">
          <img
            className="h-full w-full rounded-lg object-cover object-center"
            src={props.content.imgSrc}
            alt={props.content.imgAlt}
            loading="lazy"
          />
        </div>
      )}
      <div className="prose prose-invert mt-8 prose-img:rounded-lg">
        {props.children}
      </div>
    </div>
  );
};

export { Content };
