import type { MarkdownHeading } from "astro";

type MobileTocProps = {
  headings: MarkdownHeading[];
};

export const MobileToc = (props: MobileTocProps) => {
  // 空の見出しリストの場合は何も表示しない
  if (props.headings.length === 0) {
    return null;
  }

  // 基本レベルの見出しを取得
  const baseLevel = props.headings[0]?.depth;
  if (baseLevel === undefined) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* details要素を使用したCSS-onlyの折りたたみ機能 */}
      <details className="group">
        <summary className="flex items-center justify-between w-full p-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-slate-600 cursor-pointer list-none">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            目次
          </span>
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>

        {/* 目次内容 */}
        <div className="pt-3 px-3 pb-2 bg-gray-100 dark:bg-slate-800 rounded-b-lg border-x border-b border-gray-300 dark:border-slate-600">
          <ul className="list-disc pl-4 space-y-2 marker:text-gray-600 dark:marker:text-gray-400">
            {props.headings
              .filter((h) => h.depth === baseLevel || h.depth === baseLevel + 1)
              .map((h) => (
                <li
                  key={h.slug}
                  className={`${
                    h.depth === baseLevel ? "text-sm" : "list-none ml-4 text-sm"
                  }`}
                >
                  <a
                    href={`#${h.slug}`}
                    className={`${
                      h.depth === baseLevel
                        ? "font-bold no-underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        : "font-normal no-underline text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    } transition-colors duration-150 block py-1`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </details>
    </div>
  );
};
