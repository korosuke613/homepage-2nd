import path from 'path';

import { AppConfig } from '@/utils/AppConfig';

type ITagProps = {
  name: string;
  color?: string;
  contentCategory: string;
};

export const Tag = (props: ITagProps) => {
  return (
    <a
      href={path.join(
        AppConfig.base,
        props.contentCategory.toLowerCase(),
        'tag',
        props.name
      )}
    >
      <div
        className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${props.color}`}
      >
        {props.name}
      </div>
    </a>
  );
};
