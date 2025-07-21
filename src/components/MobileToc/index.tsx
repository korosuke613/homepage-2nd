import { useState } from "react";
import type { MarkdownHeading } from "astro";

type MobileTocProps = {
  headings: MarkdownHeading[];
};

export const MobileToc = (props: MobileTocProps) => {
  // useState hookを使用した表示/非表示状態管理
  const [isOpen, setIsOpen] = useState(false);

  // 空の見出しリストの場合は何も表示しない
  if (props.headings.length === 0) {
    return <></>;
  }

  // 基本レベルの見出しを取得
  const baseLevel = props.headings[0]?.depth;
  if (baseLevel === undefined) {
    return <></>;
  }

  // 目次ボタンクリック時の表示/非表示切り替え機能
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 目次項目クリック後の自動折りたたみ機能
  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="mb-4">
      {/* 折りたたみボタンのデザイン実装 */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 border border-slate-600"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-content"
      >
        <span className="font-semibold text-gray-100">目次</span>
        <svg
          className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* スムーズなアニメーション効果の追加 */}
      <div
        id="mobile-toc-content"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-3 px-3 pb-2 bg-slate-800 rounded-b-lg border-x border-b border-slate-600">
          <ul className="list-disc pl-4 space-y-2 marker:text-gray-400">
            {props.headings.map((h) => {
              if (baseLevel === h.depth) {
                return (
                  <li key={h.slug} className="text-sm">
                    <a
                      href={`#${h.slug}`}
                      onClick={handleItemClick}
                      className="font-bold no-underline text-blue-400 hover:text-blue-300 transition-colors duration-150 block py-1"
                    >
                      {h.text}
                    </a>
                  </li>
                );
              }
              if (baseLevel + 1 === h.depth) {
                return (
                  <li key={h.slug} className="list-none ml-4 text-sm">
                    <a
                      href={`#${h.slug}`}
                      onClick={handleItemClick}
                      className="font-normal no-underline text-gray-300 hover:text-gray-100 transition-colors duration-150 block py-1"
                    >
                      {h.text}
                    </a>
                  </li>
                );
              }
              // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
              return <></>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
