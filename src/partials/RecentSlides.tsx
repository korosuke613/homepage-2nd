import { GradientText } from "@/components/GradientText";
import { Section } from "@/components/Section";
import { SlideCard } from "@/components/SlideCard";
import type { SlideData } from "@/types/ISlide";
import type { Tags } from "@/utils/Tag";

export type IRecentSlidesProps = {
  tags: Tags;
  postList: SlideData[];
};

export const RecentSlides = (props: IRecentSlidesProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Slides</GradientText>
        </div>

        <div className="text-sm">
          <a href="slides">View all Slides →</a>
        </div>
      </div>
    }
  >
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {props.postList.map((elt) => (
        <SlideCard
          key={elt.id}
          elt={elt}
          tags={props.tags}
        />
      ))}
    </div>
  </Section>
);