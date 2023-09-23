import path from "path";

import { GradientText } from "@/components/GradientText";
import { PostGallery } from "@/components/PostGallery";
import { Section } from "@/components/Section";
import type { IPost } from "@/types/IArticleFrontmatter";
import { AppConfig } from "@/utils/AppConfig";
import type { Tags } from "@/utils/Tag";

type IRecentPickupProps = {
  tags: Tags;
  postList: IPost[];
};

export const RecentPickup = (props: IRecentPickupProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          <GradientText>Pickup</GradientText>
        </div>

        <div className="text-sm">
          <a href={path.join(AppConfig.base, "posts", "tag", "Pickup ⭐️")}>
            View all Pickup →
          </a>
        </div>
      </div>
    }
  >
    <PostGallery
      postList={props.postList}
      tags={props.tags}
      contentCategory="Posts"
    />
  </Section>
);
