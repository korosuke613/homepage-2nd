import type { ReactNode } from "react";

export type IExternalLinkProps = {
  title: ReactNode;
  url: string;
  noClass?: boolean;
};

export const ExternalLink: React.FC<IExternalLinkProps> = ({
  title,
  url,
  noClass,
}) => {
  let cssClass = "text-cyan-400 hover:underline";
  if (noClass === true) {
    cssClass = "";
  }

  return (
    <>
      <a
        className={cssClass}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    </>
  );
};
