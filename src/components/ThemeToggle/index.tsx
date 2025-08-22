import { useCallback, useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const updateTheme = useCallback((newTheme: "light" | "dark") => {
    const htmlElement = document.documentElement;
    if (newTheme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  }, []);

  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, [updateTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600"
      aria-label="テーマ切り替え"
      title={
        theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"
      }
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          theme === "dark" ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <span className="absolute left-1 text-xs">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};
