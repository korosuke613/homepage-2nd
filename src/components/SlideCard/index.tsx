import { format } from "date-fns";

import type { SlideData } from "@/types/ISlide";
import type { Tags } from "@/utils/Tag";

import { ExternalLink } from "../ExternalLink";
import { Tag } from "../Tag";

type ISlideCard = {
  elt: SlideData;
  tags: Tags;
};

export const SlideCard = (props: ISlideCard) => {
  // サムネイル画像のデフォルト
  const thumbnailUrl =
    props.elt.thumbnailUrl || "/assets/images/default-slide-thumbnail.webp";

  return (
    <div
      key={props.elt.id}
      className="relative overflow-hidden rounded-md bg-slate-800"
    >
      <div
        key={props.elt.title}
        className="aspect-h-2 aspect-w-5 xs:aspect-h-2 xs:aspect-w-7 sm:aspect-none"
      >
        <ExternalLink url={props.elt.url}>
          <img
            className="h-full w-full object-cover object-center"
            src={thumbnailUrl}
            alt={props.elt.title}
            loading="lazy"
          />
        </ExternalLink>
      </div>
      <div
        key={props.elt.id}
        className="absolute sm:static inset-0 flex flex-col justify-center"
      >
        <div
          key={props.elt.id}
          className="px-3 py-1.5 bg-gradient-to-br from-violet-900 to-violet-900/50 backdrop-blur-sm"
        >
          <ExternalLink url={props.elt.url} noClass={true}>
            <div key={props.elt.id}>
              <div className="sm:h-12">
                <p
                  className="line-clamp-1 xs:line-clamp-2 text-base font-semibold"
                  title={props.elt.title}
                >
                  {props.elt.title}
                </p>
              </div>
              <div className="text-xs text-gray-100 my-1.5 flex justify-between">
                <p>{format(new Date(props.elt.pubDate), "LLL d, yyyy")}</p>
                <p className="capitalize">{props.elt.type}</p>
              </div>
            </div>
          </ExternalLink>
          <div
            key={`${props.elt.id}-tags`}
            className="mt-1 flex flex-wrap gap-2"
          >
            {Object.keys(props.tags).map((tagName) => {
              if (props.tags?.[tagName] === undefined) {
                throw new Error("Tags don't match");
              }
              if (!props.elt.category.includes(tagName)) {
                return;
              }
              return (
                <Tag
                  key={tagName}
                  name={tagName}
                  color={props.tags[tagName]}
                  contentCategory={"Slides"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
