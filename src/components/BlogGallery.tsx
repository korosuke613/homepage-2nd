import { format } from 'date-fns';

import { ExternalLink } from '@/partials/ExternalLink';
import type { IRecentBlogsProps } from '@/partials/RecentBlogs';
import { CardClass } from '@/utils/Css';
import { transformTitleForContentCard } from '@/utils/StringWidth';

import { Tag } from './Tag';

export const BlogGallery = (props: IRecentBlogsProps) => {
  if (props.tags === undefined) {
    throw new Error('Tags are required');
  }
  const { tags } = props;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.postList.map((elt) => (
        <div className="overflow-hidden rounded-md bg-slate-800 bg-gradient-to-br from-violet-900 backdrop-blur-lg">
          <div style={CardClass}>
            <ExternalLink
              title={
                <img
                  className="h-full w-full object-cover object-center"
                  src={elt.ogpImageUrl}
                />
              }
              url={elt.url}
            />
          </div>
          <div className="inset-0 flex flex-col justify-center">
            <div className="py-1.5 px-3">
              <ExternalLink
                title={
                  <div>
                    <span className="text-base font-semibold">
                      {transformTitleForContentCard(elt.title)}
                    </span>
                    <br />
                    <span className="align-middle text-xs text-gray-300	">
                      {format(new Date(elt.pubDate), 'LLL d, yyyy')}
                    </span>
                  </div>
                }
                url={elt.url}
                noClass={true}
              />
              <div className="mt-1 flex flex-wrap gap-2">
                {Object.keys(tags).map((tagName) => {
                  if (tags?.[tagName] === undefined) {
                    throw new Error("Tags don't match");
                  }
                  if (!elt.category.includes(tagName)) {
                    return <></>;
                  }
                  return (
                    <Tag
                      key={tagName}
                      name={tagName}
                      color={tags[tagName]}
                      contentCategory={'Blogs'}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
