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
  }

  const createLink = (i: number) => {
    if (i === page.currentPage) {
      return (
        <span key={i} className="font-bold underline underline-offset-4">
          {i.toString()}
        </span>
      );
    }
    if (i === 1) {
      return (
        <a key={i} href={currentPageBaseUrl}>
          {i}
        </a>
      );
    }
    return (
      <a
        key={i}
        href={`${currentPageBaseUrl}/${i.toString()}`.replaceAll("//", "/")}
      >
        {i}
      </a>
    );
  };

  const createEllipsis = (key: string) => (
    <span key={key} className="text-gray-400">
      ...
    </span>
  );

  // 表示するページ番号を決定
  const current = page.currentPage;
  const last = page.lastPage;
  const delta = 3; // 現在のページの前後に表示するページ数

  if (last <= 7) {
    // ページ数が少ない場合は全て表示
    for (let i = 1; i <= last; i++) {
      items.push(createLink(i));
    }
  } else {
    // 最初のページは常に表示
    items.push(createLink(1));

    // 現在のページの前後のページを表示
    const leftBound = Math.max(2, current - delta);
    const rightBound = Math.min(last - 1, current + delta);

    // 左側の省略記号
    if (leftBound > 2) {
      items.push(createEllipsis("left"));
    }

    // 中央のページ番号
    for (let i = leftBound; i <= rightBound; i++) {
      items.push(createLink(i));
    }

    // 右側の省略記号
    if (rightBound < last - 1) {
      items.push(createEllipsis("right"));
    }

    // 最後のページは常に表示
    if (rightBound < last) {
      items.push(createLink(last));
    }
  }

  return items;
};

export const NewerOlderPagination = (props: INewerOlderPaginationProps) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Check the existence of props since they are sometimes undefined during astro dev.
      // ref: https://github.com/withastro/astro/issues/9110
      if (props === undefined) return;

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
    [props],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Check the existence of props since they are sometimes undefined during astro dev.
  // ref: https://github.com/withastro/astro/issues/9110
  if (props === undefined) return null;

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
