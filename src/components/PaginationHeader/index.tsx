import type { ReactNode } from "react";

type IPaginationProps = {
  title: ReactNode;
  description: string;
};

export const PaginationHeader = (props: IPaginationProps) => (
  <>
    <h1 className="text-3xl font-bold text-center">{props.title}</h1>
    <div className="mt-3 text-gray-200 text-center">{props.description}</div>
  </>
);
