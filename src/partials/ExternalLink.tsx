import type { ReactNode } from 'react';

type IExternalLinkProps = {
  title: ReactNode;
  url: string;
  noClass?: boolean;
};

export const ExternalLink = (props: IExternalLinkProps) => {
  let cssClass = 'text-cyan-400 hover:underline';
  if (props.noClass === true) {
    cssClass = '';
  }

  return (
    <>
      <a
        className={cssClass}
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.title}
      </a>
    </>
  );
};
