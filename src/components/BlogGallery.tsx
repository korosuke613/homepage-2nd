import { format } from 'date-fns';

import type { BlogPage } from '@/types/IBlogPage';
import { transformTitleForContentCard } from '@/utils/StringWidth';
import type { Tags } from '@/utils/Tag';

import { Tag } from './Tag';

type IRecentBlogsProps = {
  tags: Tags;
  page: BlogPage;
};

export const BlogGallery = (props: IRecentBlogsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.page.data.map((elt) => (
        <div className="rounded-md bg-slate-800">
          <img src={elt.ogpImageUrl} />
          <div className="inset-0 flex flex-col justify-center">
            <div className="bg-gradient-to-br from-violet-900 backdrop-blur-lg">
              <div className="py-1.5 px-3">
                <a href={elt.id}>
                  <div>
                    {transformTitleForContentCard(elt.title)
                      .split('\\n')
                      .map((t) => (
                        <span key={t} className="text-base font-semibold">
                          {t}
                          <br />
                        </span>
                      ))}
                    <span className="align-middle text-xs text-gray-300	">
                      {format(new Date(elt.pubDate), 'LLL d, yyyy')}
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
      ))}
    </div>
  );
};
