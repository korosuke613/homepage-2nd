import type { MarkdownHeading } from "astro";

type TocProps = {
  headings: MarkdownHeading[];
};

export const Toc = (props: TocProps) => {
  if (props.headings.length === 0) {
    return null;
  }
  const baseLevel = props.headings[0]?.depth;
  if (baseLevel === undefined) {
    return null;
  }
  return (
    <ul className="list-disc">
      {props.headings.map((h) => {
        if (baseLevel === h.depth) {
          return (
            <li key={h.slug} className="pt-2">
              <a
                key={h.slug}
                className="font-bold no-underline"
                href={`#${h.slug}`}
              >
                {h.text}
              </a>
            </li>
          );
        }
        if (baseLevel + 1 === h.depth) {
          return (
            <li key={h.slug} className="list-none pt-2">
              <a
                key={h.slug}
                className=" font-thin no-underline"
                href={`#${h.slug}`}
              >
                {h.text}
              </a>
            </li>
          );
        }
        // if (baseLevel + 2 === h.depth) {
        //   return (
        //     <li className="list-none">
        //       <a className="font-thin no-underline" href={`#${h.slug}`}>
        //         {h.text}
        //       </a>
        //     </li>
        //   );
        // }
        return null;
      })}
    </ul>
  );
};
