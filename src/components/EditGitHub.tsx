import { BsGithub } from "react-icons/bs/index";

import { AppConfig } from "@/utils/AppConfig";
import { getGitHubUrl } from "@/utils/Posts";

type IEditGitHubProps = {
  id: string;
  collection: string;
};

export const EditGitHub = (props: IEditGitHubProps) => {
  const githubUrl = getGitHubUrl(
    AppConfig.github_url,
    props.collection,
    props.id,
  );

  return (
    <a
      style={{ height: "fit-content" }}
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        type="button"
        className="rounded-lg bg-violet-900 px-2.5 py-0.5 text-sm"
      >
        <BsGithub size="16px" className="inline-block pb-0.5" /> GitHub
        で編集する
      </button>
    </a>
  );
};
