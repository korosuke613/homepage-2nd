import path from "path";

import { AppConfig } from "@/utils/AppConfig";

export const getSectionTitle = (
  preTitle: string | number | undefined,
  contentCategory: string,
) => {
  const linkedContentCategory = (
    <a href={path.join(AppConfig.base, contentCategory.toLowerCase())}>
      {contentCategory}
    </a>
  );

  if (preTitle === undefined) {
    return linkedContentCategory;
  }

  return (
    <>
      {preTitle} / {linkedContentCategory}
    </>
  );
};
