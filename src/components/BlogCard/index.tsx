import { format } from "date-fns";

import type { BlogData } from "@/types/IBlogPage";
import type { Tags } from "@/utils/Tag";

import { ExternalLink } from "../ExternalLink";
import { Tag } from "../Tag";

type IBlogCard = {
  elt: BlogData;
  viewCount?: number;
  tags: Tags;
};

export const BlogCard = (props: IBlogCard) => {
  return (
    <div
      key={props.elt.id}
      className="relative overflow-hidden rounded-md bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div
        key={props.elt.title}
        className="aspect-h-2 aspect-w-5 xs:aspect-h-2 xs:aspect-w-7 sm:aspect-none"
      >
        <ExternalLink url={props.elt.url}>
          <img
            className="h-full w-full object-cover object-center"
            src={props.elt.ogpImageUrl}
            alt={props.elt.title}
            loading="lazy"
          />
        </ExternalLink>
      </div>
      {/* <div className="block xs:hidden">
        <ExternalLink
          title={
            <img
              className="h-full w-full object-cover object-center"
              src={props.elt.ogpImageUrl}
              alt={props.elt.title}
              loading="lazy"
            />
          }
          url={props.elt.url}
        />
      </div> */}
      <div
        key={props.elt.id}
        className="absolute sm:static inset-0 flex flex-col justify-center"
      >
        <div
          key={props.elt.id}
          className="px-3 py-1.5 bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-violet-900 dark:to-violet-900/50 backdrop-blur-sm"
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
              <div className="text-xs text-gray-800 dark:text-gray-100 my-1.5 flex justify-between">
                <p>{format(new Date(props.elt.pubDate), "LLL d, yyyy")}</p>
                {props.viewCount !== undefined && props.viewCount > 0 && (
                  <p>{props.viewCount} views</p>
                )}
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
                  contentCategory={"Blogs"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
