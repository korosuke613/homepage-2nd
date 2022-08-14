export const getSectionTitle = (
  preTitle: string | number | undefined,
  contentCategory: string
) => {
  const linkedContentCategory = (
    <a href={`/${contentCategory.toLowerCase()}`}>{contentCategory}</a>
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
