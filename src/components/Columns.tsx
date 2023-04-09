import type { ReactNode } from 'react';

export const ImageAndDescription = (props: {
  imageSrc: string;
  alt: string;
  children: ReactNode;
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <img alt={props.alt} src={props.imageSrc} />
      <div>{props.children}</div>
    </div>
  );
};
