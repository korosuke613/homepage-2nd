import type { RandomArticle } from "@/utils/Random";
import type React from "react";
import { useState } from "react";

interface RandomArticleCardProps {
  initialArticle: RandomArticle;
}

export const RandomArticleCard: React.FC<RandomArticleCardProps> = ({
  initialArticle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    window.location.reload();
  };

  return (
    <div className="text-center max-w-2xl w-full justify-items-center">
      <h1 className="text-3xl font-bold mb-6">ランダム記事</h1>

      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-6 w-[30rem]">
        <div className="relative w-full pb-[56.25%]">
          {initialArticle.imageSrc ? (
            <img
              src={initialArticle.imageSrc}
              alt={initialArticle.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-slate-700 flex items-center justify-center">
              <span className="text-slate-400">No image</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3">{initialArticle.title}</h2>

          {initialArticle.pubDate && (
            <div className="text-gray-400 text-sm mb-3">
              投稿日:{" "}
              {new Date(initialArticle.pubDate).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}

          {initialArticle.description && (
            <p className="text-gray-300 mb-6">{initialArticle.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm">
              {initialArticle.type === "post" ? "Post" : "Blog"}
            </span>

            <a
              href={initialArticle.url}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              記事を読む
            </a>
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-400">
        <p>
          総記事数{" "}
          <span className="font-bold text-white">
            {initialArticle.totalCount}
          </span>{" "}
          件の中からランダムに表示しています
        </p>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={isLoading}
        className={`mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "読み込み中..." : "別の記事を表示"}
      </button>
    </div>
  );
};
