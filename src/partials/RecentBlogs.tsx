import { GradientText } from '@/components/GradientText';
import { Section } from '@/components/Section';
import type { BlogData } from '@/types/IZenn';
import type { Tags } from '@/utils/Tag';

import { ExternalLink } from './ExternalLink';

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
        <ExternalLink
          title={<img src={elt.ogpImageUrl} />}
          url={elt.url}
        ></ExternalLink>
      ))}
    </div>
  </Section>
);
