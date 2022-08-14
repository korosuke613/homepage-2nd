import path from 'path';
import type { ReactNode } from 'react';

import type { ProjectFrontmatterPage } from '@/types/IProjectFrontmatter';
import { AppConfig } from '@/utils/AppConfig';

type INewerOlderPaginationProps = {
  page: ProjectFrontmatterPage;
};

export const NewerOlderPagination = (props: INewerOlderPaginationProps) => (
  <div className="flex justify-center gap-8">
    {props.page.url.prev && (
      <a href={path.join(AppConfig.base, props.page.url.prev)}>← Newer Posts</a>
    )}
    {props.page.url.next && (
      <a href={path.join(AppConfig.base, props.page.url.next)}>Older Posts →</a>
    )}
  </div>
);

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
