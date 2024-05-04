type ITitleProps = {
  preTitle: string | number | undefined;
  contentCategory: string;
};

export const Title: React.FC<ITitleProps> = ({ preTitle, contentCategory }) => {
  if (preTitle === undefined) {
    return contentCategory;
  }

  return `${preTitle} / ${contentCategory}`;
};
