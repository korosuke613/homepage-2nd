import { format } from 'date-fns';
import path from 'path';

import type { IPost } from '@/types/IArticleFrontmatter';
import { AppConfig } from '@/utils/AppConfig';
import { transformTitleForContentCard } from '@/utils/StringWidth';
import type { Tags } from '@/utils/Tag';

import { Tag } from './Tag';

type IPostCardProps = {
  instance: IPost;
  contentCategory: string;
  tags: Tags;
};

export const PostCard = (props: IPostCardProps) => {
  const contentPath = path.join(
    '/',
    props.instance.collection,
    props.instance.slug
  );

  return (
    <div className="relative overflow-hidden rounded-md bg-slate-800">
      <div className="aspect-h-9 aspect-w-16">
        {props.instance.data.imgSrc && (
          <img
            className="h-full w-full object-cover object-center"
            src={path.join(AppConfig.base, props.instance.data.imgSrc)}
            alt={props.instance.data.imgSrc}
            loading="lazy"
          />
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-center">
        <div className="bg-gradient-to-br from-violet-900 backdrop-blur-lg">
          <div className="px-3 py-1.5">
            <a href={contentPath}>
              <div>
                {transformTitleForContentCard(props.instance.data.title)
                  .split('\\n')
                  .map((t) => (
                    <span key={t} className="text-lg font-bold">
                      {t}
                      <br />
                    </span>
                  ))}
                <span className="align-middle text-xs text-gray-300	">
                  {format(new Date(props.instance.data.pubDate), 'LLL d, yyyy')}
                </span>
              </div>
            </a>
            <div className="mt-1 flex flex-wrap gap-2">
              {props.instance.data.tags &&
                props.instance.data.tags.map((tagName) => (
                  <Tag
                    key={tagName}
                    name={tagName}
                    color={props.tags[tagName]}
                    contentCategory={props.contentCategory}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
