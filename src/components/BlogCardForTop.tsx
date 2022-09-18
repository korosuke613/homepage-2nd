import { format } from 'date-fns';

import type { BlogData } from '@/types/IBlogPage';
import { transformTitleForContentCard } from '@/utils/StringWidth';
import type { Tags } from '@/utils/Tag';

import { Tag } from './Tag';

type IBlogCardForTopProps = {
  zennData: BlogData;
  tags: Tags;
};

export const BlogCardForTop = (props: IBlogCardForTopProps) => (
  <div className="relative overflow-hidden rounded-md bg-slate-800">
    <div className="aspect-w-3 aspect-h-2">
      {props.zennData.ogpImageUrl && (
        <img
          className="h-full w-full object-cover object-center"
          src={props.zennData.ogpImageUrl}
          alt={props.zennData.title}
          loading="lazy"
        />
      )}
    </div>

    <div className="absolute inset-0 flex flex-col justify-center">
      <div className="bg-gradient-to-br from-violet-900 backdrop-blur-lg">
        <div className="py-1.5 px-3">
          <a href={props.zennData.url}>
            <div>
              {transformTitleForContentCard(props.zennData.title)
                .split('\\n')
                .map((t) => (
                  <span key={t} className="text-lg font-bold">
                    {t}
                    <br />
                  </span>
                ))}
              <span className="align-middle text-xs text-gray-300	">
                {format(new Date(props.zennData.pubDate), 'LLL d, yyyy')}
              </span>
            </div>
          </a>
          <div className="mt-1 flex flex-wrap gap-2">
            {props.tags &&
              Object.keys(props.tags).map((tagName) => (
                <Tag
                  key={tagName}
                  name={tagName}
                  color={props.tags[tagName]}
                  contentCategory={'Posts'}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
