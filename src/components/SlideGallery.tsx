import type { SlideData } from "@/types/ISlide";
import type { Tags } from "@/utils/Tag";

import { SlideCard } from "./SlideCard";

export type ISlideGalleryProps = {
  tags: Tags;
  postList: SlideData[];
};

export const SlideGallery = (props: ISlideGalleryProps) => {
  // Check the existence of props since they are sometimes undefined during astro dev.
  // ref: https://github.com/withastro/astro/issues/9110
  if (props === undefined) return null;

  const { tags } = props;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {props.postList.map((elt) => (
        <SlideCard
          key={elt.id}
          elt={elt}
          tags={tags}
        />
      ))}
    </div>
  );
};