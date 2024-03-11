import path from "node:path";

import { AppConfig } from "@/utils/AppConfig";

type IYearProps = {
  year: string;
  contentCategory: string;
};

export const Year = (props: IYearProps) => {
  return (
    <a
      href={path.join(
        AppConfig.base,
        props.contentCategory.toLowerCase(),
        "year",
        props.year,
      )}
    >
      <div className={"px-1 py-0.5 text-sm font-semibold"}>{props.year}</div>
    </a>
  );
};
