import { escapeTag } from "@/utils/Tag";

type ITagProps = {
  name: string;
  color?: string;
  contentCategory: string;
};

export const Tag = (props: ITagProps) => {
  return (
    <a
      href={`/${props.contentCategory.toLowerCase()}/tag/${escapeTag(
        props.name,
      )}`}
    >
      <div
        className={`contents_tag rounded-md px-1.5 py-0.5 text-xs font-semibold ${props.color}`}
      >
        {props.name}
      </div>
    </a>
  );
};
