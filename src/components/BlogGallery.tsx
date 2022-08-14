import { format } from 'date-fns';

import { ExternalLink } from '@/partials/ExternalLink';
import type { IRecentBlogsProps } from '@/partials/RecentBlogs';
import { BlogTags } from '@/utils/Blog';
import { transformTitleForContentCard } from '@/utils/StringWidth';

import { Tag } from './Tag';

export const BlogGallery = (props: IRecentBlogsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.postList.map((elt) => (
        <div className="rounded-md bg-slate-800 bg-gradient-to-br from-violet-900 backdrop-blur-lg">
          <ExternalLink title={<img src={elt.ogpImageUrl} />} url={elt.url} />
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
                {Object.keys(BlogTags).map((tagName) => (
                  <Tag
                    key={tagName}
                    name={tagName}
                    color={BlogTags[tagName]}
                    contentCategory={'Blogs'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
