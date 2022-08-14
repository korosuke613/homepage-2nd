import { GradientText } from '@/components/GradientText';
import { Section } from '@/components/Section';
import type { ZennData } from '@/types/IZenn';

import { ExternalLink } from './ExternalLink';

export type IRecentBlogsProps = {
  postList: ZennData[];
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
