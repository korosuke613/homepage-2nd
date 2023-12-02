import { AppConfig } from "@/utils/AppConfig";

type ITitleProps = {
  preTitle: string | number | undefined;
  contentCategory: string;
};

export const Title: React.FC<ITitleProps> = ({ preTitle, contentCategory }) => {
  const linkedContentCategory = (
    <a href={`${AppConfig.base}/${contentCategory.toLowerCase()}`}>
      {contentCategory}
    </a>
  );

  if (preTitle === undefined) {
    return linkedContentCategory;
  }

  return (
    <>
      <span>
        {preTitle} / {linkedContentCategory}
      </span>
    </>
  );
};
