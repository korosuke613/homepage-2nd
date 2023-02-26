import type { CollectionEntry } from 'astro:content';
import path from 'path';
import { BsGithub } from 'react-icons/bs/index';

import { AppConfig } from '@/utils/AppConfig';

type IEditGitHubProps = {
  content: CollectionEntry<'posts'>;
};

export const EditGitHub = (props: IEditGitHubProps) => {
  if (props.content.id === undefined) {
    return <></>;
  }

  const url = path.join(
    AppConfig.github_url,
    'tree',
    'main',
    'src',
    'pages',
    props.content.id
  );

  return (
    <div className="flex justify-end">
      <a
        style={{ height: 'fit-content' }}
        href={`https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="rounded-lg bg-violet-900 px-2.5 py-0.5  text-sm">
          <BsGithub size="16px" className="inline-block pb-0.5" /> GitHub
          で編集する
        </button>
      </a>
    </div>
  );
};
