import type { MarkdownHeading } from 'astro';

export const convertMarkdownHeadingsToObject = (
  headings: MarkdownHeading[]
) => {
  const obj: {
    [key: string]: MarkdownHeading;
  } = {};

  headings.forEach((h) => {
    obj[h.slug] = h;
  });

  return obj;
};

export const MarkdownHeadingComponent = (props: {
  heading?: MarkdownHeading;
}) => {
  if (props.heading === undefined) {
    return <></>;
  }

  const h = props.heading;

  if (h.depth === 1) {
    return <h1 id={h.slug}>{h.text}</h1>;
  }
  if (h.depth === 2) {
    return <h2 id={h.slug}>{h.text}</h2>;
  }
  if (h.depth === 3) {
    return <h3 id={h.slug}>{h.text}</h3>;
  }
  if (h.depth === 4) {
    return <h4 id={h.slug}>{h.text}</h4>;
  }
  if (h.depth === 5) {
    return <h5 id={h.slug}>{h.text}</h5>;
  }
  return <span id={h.slug}>{h.text}</span>;
};
