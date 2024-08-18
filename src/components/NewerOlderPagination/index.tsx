import type { Page } from "astro";
import { type ReactNode, useCallback, useEffect } from "react";

type INewerOlderPaginationProps = {
  page: Page;
};

const createPageNumberLink = (page: Page) => {
  const items: ReactNode[] = [];
  let currentPageBaseUrl = page.url.current;
  if (page.currentPage !== 1) {
    currentPageBaseUrl = currentPageBaseUrl.split("/").slice(0, -1).join("/");
    console.log(currentPageBaseUrl);
  }

  for (let i = 1; i <= page.lastPage; i += 1) {
    if (i === page.currentPage) {
      items.push(
        <span className="font-bold underline underline-offset-4">
          {i.toString()}
        </span>,
      );
    } else if (i === 1) {
      items.push(<a href={currentPageBaseUrl}>{i}</a>);
    } else {
      items.push(
        <a href={`${currentPageBaseUrl}/${i.toString()}`.replaceAll("//", "/")}>
          {i}
        </a>,
      );
    }
  }

  return items;
};

export const NewerOlderPagination = (props: INewerOlderPaginationProps) => {
  // Check the existence of props since they are sometimes undefined during astro dev.
  // ref: https://github.com/withastro/astro/issues/9110
  if (props === undefined) return <></>;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          // 左キーが押されたら前のページに遷移する
          if (props.page.url.prev) location.href = props.page.url.prev;
          break;
        case "ArrowRight":
          // 右キーが押されたら次のページに遷移する
          if (props.page.url.next) location.href = props.page.url.next;
          break;
      }
    },
    [props.page.url.prev, props.page.url.next],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="flex justify-center gap-8">
      {props.page.url.prev && <a href={props.page.url.prev}>←</a>}
      {props.page.lastPage !== 1 && (
        <div className="hidden justify-center gap-4 xs:flex">
          {createPageNumberLink(props.page)}
        </div>
      )}

      {props.page.url.next && <a href={props.page.url.next}>→</a>}
    </div>
  );
};
