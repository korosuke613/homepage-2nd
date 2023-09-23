import { format } from "date-fns";
import type { CollectionEntry } from "astro:content";

import type { Tags } from "@/utils/Tag";

import { Tag } from "./Tag";

type IContentHeaderProps = {
  content: CollectionEntry<"posts">;
  author: string;
  tags: Tags;
  contentCategory: string;
};

export const ContentHeader = (props: IContentHeaderProps) => (
  <>
    <h1 id="contents_header" className="text-center text-3xl font-bold">
      {props.content.data.title.replace("\\n", "")}
    </h1>

    <div className="mt-2 text-center text-sm text-gray-400">
      By {props.author} on{" "}
      {format(new Date(props.content.data.pubDate), "LLL d, yyyy")}
    </div>

    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {props.tags &&
        Object.keys(props.tags).map((tagName) => (
          <Tag
            name={tagName}
            key={tagName}
            color={props.tags[tagName]}
            contentCategory={props.contentCategory}
          />
        ))}
    </div>

    {/* <div className="mt-2 text-center text-sm  text-gray-300">
      概要: {props.content.description}
    </div> */}
  </>
);
