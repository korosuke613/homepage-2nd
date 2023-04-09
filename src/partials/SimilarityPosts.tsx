import { ExternalLink } from '@/components/ExternalLink';
import type { getSimilarPosts } from '@/utils/TextSimilarity';

type ISimilarityPosts = {
  similars: ReturnType<typeof getSimilarPosts>;
};

export const SimilarityPosts = (props: ISimilarityPosts) => {
  return (
    <div>
      <hr className="my-10" />
      <h3 className="my-4 text-2xl font-bold">あわせて読む</h3>
      <ul className="list-disc">
        {props.similars
          .map((s) => {
            return (
              <li key={s.meta.url} className="list-inside pt-2">
                {s.meta.urlType === 'internal' && (
                  <a
                    className="text-cyan-400 hover:underline"
                    href={s.meta.url}
                  >
                    {s.meta.title}
                  </a>
                )}
                {s.meta.urlType === 'external' && (
                  <span>
                    <ExternalLink title={s.meta.title} url={s.meta.url} />{' '}
                    <span className="text-xs">[外部リンク]</span>
                  </span>
                )}
                <span className="text-xs">
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
