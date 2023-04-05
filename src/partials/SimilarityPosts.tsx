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
              <li className="list-inside pt-2	">
                <a
                  className="text-cyan-400 hover:underline"
                  href={`/${s.meta.collection}/${s.meta.slug}`}
                >
                  {s.meta.data.title.replaceAll('\\n', '')}
                </a>
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
