import { BlogCard } from "@/components/BlogCard";
import { GradientText } from "@/components/GradientText";
import { Section } from "@/components/Section";
import type { BlogData } from "@/types/IBlogPage";
import type { Tags } from "@/utils/Tag";

export type IRecentBlogsProps = {
  tags: Tags;
  viewCounts: Record<string, number>;
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {props.postList.map((elt) => (
        <BlogCard
          key={elt.id}
          elt={elt}
          tags={props.tags}
          viewCount={props.viewCounts[elt.url]}
        />
      ))}
    </div>
  </Section>
);
