import type { ReactNode } from "react";

export type IExternalLinkProps = {
  url: string;
  noClass?: boolean;
  children?: ReactNode;
};

export const ExternalLink: React.FC<IExternalLinkProps> = ({
  children,
  url,
  noClass,
}) => {
  let cssClass = "text-cyan-400 hover:underline";
  if (noClass === true) {
    cssClass = "";
  }

  return (
    <a
      className={cssClass}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
