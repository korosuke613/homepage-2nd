import path from 'path';
import { BsGithub } from 'react-icons/bs/index';

import type { IArticleFrontmatter } from '@/types/IArticleFrontmatter';
import { AppConfig } from '@/utils/AppConfig';

type IEditGitHubProps = {
  content: IArticleFrontmatter;
};

export const EditGitHub = (props: IEditGitHubProps) => {
  if (props.content.url === undefined) {
    return <></>;
  }

  const url = path.join(
    AppConfig.github_url,
    'tree',
    'main',
    'src',
    'pages',
    props.content.url
  );

  return (
    <div className="justify-end flex">
      <a
        style={{ height: 'fit-content' }}
        href={`https://${url}.md`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="px-2.5 py-0.5 text-sm rounded-lg bg-violet-900">
          <BsGithub size="16px" className="pb-0.5 inline-block" /> GitHub
          で編集する
        </button>
      </a>
    </div>
  );
};
