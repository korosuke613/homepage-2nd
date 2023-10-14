import type { ReactNode } from "react";

export const ImageAndDescription = (props: {
  children: ReactNode;
}) => {
  return <div className="grid grid-cols-2 gap-6">{props.children}</div>;
};
