import { format } from "date-fns";

import type { IPost } from "@/types/IArticleFrontmatter";
import type { Tags } from "@/utils/Tag";

import { Tag } from "@/components/Tag";

type IPostCardProps = {
  instance: IPost;
  contentCategory: string;
  tags: Tags;
};

export const PostCard = (props: IPostCardProps) => {
  const contentPath = `/${props.instance.collection}/${props.instance.slug}`;

  return (
    <div className="relative overflow-hidden rounded-md bg-slate-800">
      <div className="aspect-h-9 aspect-w-16">
        {props.instance.data.imgSrc && (
          <img
            className="h-full w-full object-cover object-center"
            src={props.instance.data.imgSrc}
            alt={props.instance.data.imgAlt}
            loading="lazy"
          />
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-center">
        <div className="bg-gradient-to-br from-violet-900 backdrop-blur-lg">
          <div className="px-3 py-1.5">
            <a href={contentPath}>
              <div>
                <span>
                  <p
                    className="text-lg font-bold line-clamp-4"
                    title={props.instance.data.title}
                  >
                    {props.instance.data.title}
                    <br />
                  </p>
                </span>
                <span className="align-middle text-xs text-gray-300">
                  {format(new Date(props.instance.data.pubDate), "LLL d, yyyy")}
                </span>
              </div>
            </a>
            <div className="mt-1 flex flex-wrap gap-2">
              {props.instance.data.tags.map((tagName) => (
                <Tag
                  key={tagName}
                  name={tagName}
                  color={props.tags[tagName]}
                  contentCategory={props.contentCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
