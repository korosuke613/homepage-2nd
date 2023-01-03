import { GradientText } from '@/components/GradientText';
import { Section } from '@/components/Section';
import type { BlogData } from '@/types/IBlogPage';
import { CardClass } from '@/utils/Css';
import type { Tags } from '@/utils/Tag';

import { ExternalLink } from '../components/ExternalLink';

export type IRecentBlogsProps = {
  tags?: Tags;
  postList: BlogData[];
};

export const RecentBlogs = (props: IRecentBlogsProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Blogs</GradientText>
        </div>

        <div className="text-sm">
          <a href="blogs">View all Blogs →</a>
        </div>
      </div>
    }
  >
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {props.postList.map((elt) => (
        // <BlogCardForTop zennData={elt} tags={BlogTags} />
        <div style={CardClass}>
          <ExternalLink
            title={
              <img
                className="h-full w-full rounded-md object-cover object-center"
                src={elt.ogpImageUrl}
                alt={elt.title}
              />
            }
            url={elt.url}
          ></ExternalLink>
        </div>
      ))}
    </div>
  </Section>
);
