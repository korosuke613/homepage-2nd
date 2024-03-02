import { format } from "date-fns";

import type { BlogData } from "@/types/IBlogPage";
import { CardClass } from "@/utils/Css";
import type { Tags } from "@/utils/Tag";

import { ExternalLink } from "../ExternalLink";
import { Tag } from "../Tag";

type IBlogCard = {
  elt: BlogData;
  tags: Tags;
};

export const BlogCard = (props: IBlogCard) => {
  return (
    <div
      key={props.elt.id}
      className="overflow-hidden rounded-md bg-slate-800 bg-gradient-to-br from-violet-900 backdrop-blur-lg"
    >
      <div key={props.elt.title} style={CardClass}>
        <ExternalLink
          title={
            <img
              className="h-full w-full object-cover object-center"
              src={props.elt.ogpImageUrl}
              alt={props.elt.title}
            />
          }
          url={props.elt.url}
        />
      </div>
      <div key={props.elt.id} className="inset-0 flex flex-col justify-center">
        <div key={props.elt.id} className="px-3 py-1.5">
          <ExternalLink
            title={
              <div key={props.elt.id}>
                <div
                  style={{
                    height: "3rem",
                  }}
                >
                  <p
                    className="line-clamp-3 text-base font-semibold"
                    title={props.elt.title}
                  >
                    {props.elt.title}
                  </p>
                </div>
                <br />
                <span className="align-middle text-xs text-gray-300	">
                  {format(new Date(props.elt.pubDate), "LLL d, yyyy")}
                </span>
              </div>
            }
            url={props.elt.url}
            noClass={true}
          />
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
