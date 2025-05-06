import { ExternalLink } from "@/components/ExternalLink";
import { AppConfig } from "@/utils/AppConfig";
import type { CommitHistory } from "@/utils/CommitHistories";

type ICommitHistoryPost = {
  collection: string;
  id: string;
  histories: CommitHistory[];
};

export const CommitHistoryPost: React.FC<ICommitHistoryPost> = (props) => {
  const url =
    props.id === "dormitory_introduction"
      ? // dormitory_introduction: https://github.com/korosuke613/homepage-2nd/commits/main/src/pages/posts/dormitory_introduction.astro
        `https://${AppConfig.github_url}/commits/main/src/pages/${props.collection}/${props.id}.astro`
      : // normal: https://github.com/korosuke613/homepage-2nd/blob/main/src/content/posts/20200324_graduate_miyazaki_u.md
        `https://${AppConfig.github_url}/commits/main/src/content/${props.collection}/${props.id}`;

  return (
    <div>
      <h3 className="my-4 text-xl font-bold">編集履歴</h3>
      <ul className="list-disc">
        {props.histories
          .map((h) => {
            // 2023-04-05T19:05:58+09:00 を 2023-04-05 に整形する
            const dateWithoutTime = h.date.split("T")[0];

            return (
              <li key={h.sha} className="list-inside pt-1 text-sm">
                <span>
                  <span>
                    <code>{dateWithoutTime}</code>:{" "}
                  </span>{" "}
                  <ExternalLink
                    url={`https://${AppConfig.github_url}/commit/${h.sha}`}
                  >
                    {h.commitMessage}
                  </ExternalLink>
                </span>
              </li>
            );
          })
          .slice(0, 6)}
        <li className="m-0 list-inside pt-1 text-sm">
          <ExternalLink url={url}>全て表示</ExternalLink>
        </li>
      </ul>
    </div>
  );
};
