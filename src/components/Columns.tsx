import type { ReactNode } from "react";

import { generateImagePath } from "@/utils/Blog";

export const ImageAndDescription = (props: {
  imageName: string[];
  alt: string;
  children: ReactNode;
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <img alt={props.alt} src={generateImagePath(...props.imageName)} />
      <div>{props.children}</div>
    </div>
  );
};
