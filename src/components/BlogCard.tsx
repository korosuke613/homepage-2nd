import { format } from 'date-fns';

import type { BlogData } from '@/types/IBlogPage';
import { CardClass } from '@/utils/Css';
import { transformTitleForContentCard } from '@/utils/StringWidth';
import type { Tags } from '@/utils/Tag';

import { ExternalLink } from './ExternalLink';
import { Tag } from './Tag';

type IBlogCard = {
  elt: BlogData;
  tags: Tags;
};

export const BlogCard = (props: IBlogCard) => {
  return (
    <div className="overflow-hidden rounded-md bg-slate-800 bg-gradient-to-br from-violet-900 backdrop-blur-lg">
      <div style={CardClass}>
        <ExternalLink
          title={
            <img
              className="h-full w-full object-cover object-center"
              src={props.elt.ogpImageUrl}
              alt={props.elt.title}
            />
          }
          url={props.elt.url}
        />
      </div>
      <div className="inset-0 flex flex-col justify-center">
        <div className="px-3 py-1.5">
          <ExternalLink
            title={
              <div>
                <span className="text-base font-semibold">
                  {transformTitleForContentCard(props.elt.title)}
                </span>
                <br />
                <span className="align-middle text-xs text-gray-300	">
                  {format(new Date(props.elt.pubDate), 'LLL d, yyyy')}
                </span>
              </div>
            }
            url={props.elt.url}
            noClass={true}
          />
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.keys(props.tags).map((tagName) => {
              if (props.tags?.[tagName] === undefined) {
                throw new Error("Tags don't match");
              }
              if (!props.elt.category.includes(tagName)) {
                return <></>;
              }
              return (
                <Tag
                  key={tagName}
                  name={tagName}
                  color={props.tags[tagName]}
                  contentCategory={'Blogs'}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
