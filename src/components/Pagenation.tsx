import path from "path";
import type { Page } from "astro";
import type { ReactNode } from "react";

import { AppConfig } from "@/utils/AppConfig";

type INewerOlderPaginationProps = {
  page: Page;
};

const createPageNumberLink = (page: Page) => {
  const items: ReactNode[] = [];
  let currentPageBaseUrl = page.url.current;
  if (page.currentPage !== 1) {
    currentPageBaseUrl = path.dirname(currentPageBaseUrl);
  }

  for (let i = 1; i <= page.lastPage; i += 1) {
    if (i === page.currentPage) {
      items.push(
        <span className="font-bold underline underline-offset-4">
          {i.toString()}
        </span>,
      );
    } else if (i === 1) {
      items.push(
        <a href={path.join(AppConfig.base, currentPageBaseUrl)}>{i}</a>,
      );
    } else {
      items.push(
        <a href={path.join(AppConfig.base, currentPageBaseUrl, i.toString())}>
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

  return (
    <div className="flex justify-center gap-8">
      {props.page.url.prev && (
        <a href={path.join(AppConfig.base, props.page.url.prev)}>←</a>
      )}
      {props.page.lastPage !== 1 && (
        <div className="hidden justify-center gap-4 sm:flex">
          {createPageNumberLink(props.page)}
        </div>
      )}

      {props.page.url.next && (
        <a href={path.join(AppConfig.base, props.page.url.next)}>→</a>
      )}
    </div>
  );
};

type IPaginationHeaderProps = {
  title: ReactNode;
  description: string;
};

export const PaginationHeader = (props: IPaginationHeaderProps) => (
  <div className="text-center">
    <h1 className="text-3xl font-bold">{props.title}</h1>

    <div className="mt-3 text-gray-200">{props.description}</div>
  </div>
);
