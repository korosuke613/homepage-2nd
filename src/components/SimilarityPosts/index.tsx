import { ExternalLink } from "@/components/ExternalLink";
import type { getSimilarPosts } from "@/utils/TextSimilarity";

type ISimilarityPosts = {
  similars: ReturnType<typeof getSimilarPosts>;
};

export const SimilarityPosts: React.FC<ISimilarityPosts> = (props) => {
  return (
    <div>
      <h3 className="my-4 text-2xl font-bold">あわせて読む</h3>
      <ul className="list-disc">
        {props.similars
          .map((s) => {
            return (
              <li key={s.meta.url} className="list-inside pt-2">
                {s.meta.urlType === "internal" && (
                  <a
                    key={s.meta.url}
                    className="text-cyan-400 hover:underline"
                    href={s.meta.url}
                  >
                    {s.meta.title}
                  </a>
                )}
                {s.meta.urlType === "external" && (
                  <span key={s.meta.url}>
                    <ExternalLink
                      key={s.meta.url}
                      title={s.meta.title}
                      url={s.meta.url}
                    />{" "}
                    <span key={s.meta.url} className="text-xs">
                      [外部リンク]
                    </span>
                  </span>
                )}
                <span key={s.meta.url} className="text-xs">
                  （類似度: <code>{s.score.toFixed(2)}</code>）
                </span>
              </li>
            );
          })
          .slice(0, 6)}
      </ul>
    </div>
  );
};
