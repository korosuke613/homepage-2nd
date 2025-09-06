import type React from "react";
import { useEffect, useState } from "react";
import type { IPost } from "@/types/IArticleFrontmatter";
import type { BlogData } from "@/types/IBlogPage";
import type { SlideData } from "@/types/ISlide";
import { getRandomArticle, type RandomArticle } from "@/utils/Random";

interface RandomArticleCardProps {
  posts: IPost[];
  blogs: BlogData[];
  slides: SlideData[];
}

const initialArticle: RandomArticle = {
  title: "Loading...",
  description: "Loading...",
  url: "",
  type: "none",
  imageSrc: undefined,
  totalCount: 0,
  pubDate: "",
};

export const RandomArticleCard: React.FC<RandomArticleCardProps> = ({
  posts,
  blogs,
  slides,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<RandomArticle>(initialArticle);

  useEffect(() => {
    setArticle(getRandomArticle(posts, blogs, slides));
  }, [posts, blogs, slides]);

  const handleRefresh = () => {
    setIsLoading(true);
    setArticle(getRandomArticle(posts, blogs, slides));
    setIsLoading(false);
  };
  return (
    <div className="text-center w-full max-w-2xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        ランダムコンテンツ
      </h1>

      <div className="min-h-[400px] sm:min-h-[520px]">
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-4 sm:mb-6 w-full">
          <div className="relative w-full pb-[56.25%]">
            {article.imageSrc ? (
              <img
                src={article.imageSrc}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-slate-700 flex items-center justify-center">
                <span className="text-slate-400">No image</span>
              </div>
            )}
          </div>

          <div
            className="p-4 sm:p-6 flex flex-col overflow-y-auto"
            style={{ maxHeight: "calc(400px - 56.25%)", minHeight: "200px" }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 line-clamp-2">
              {article.title}
            </h2>

            {article.pubDate && (
              <div className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                投稿日:{" "}
                {new Date(article.pubDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-3 sm:gap-0">
              <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs sm:text-sm">
                {article.type === "post"
                  ? "Post"
                  : article.type === "blog"
                    ? "Blog"
                    : "Slide"}
              </span>

              <a
                href={article.url}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 sm:py-2 px-4 sm:px-6 rounded transition-colors w-full sm:w-auto text-center"
              >
                {article.type === "slide" ? "スライドを見る" : "記事を読む"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-400 text-sm">
        <p>
          総コンテンツ数{" "}
          <span className="font-bold text-white">{article.totalCount}</span>{" "}
          件（記事・ブログ・スライド）の中からランダムに表示しています
        </p>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={isLoading}
        className={`mt-2 sm:mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors w-full sm:w-auto ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "読み込み中..." : "別のコンテンツを表示"}
      </button>
    </div>
  );
};
