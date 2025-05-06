/**
 * パスを結合する関数（ブラウザ互換）
 * node:pathのpath.join()の代わりにブラウザでも使えるパス結合関数
 * @param segments 結合するパスのセグメント
 * @returns 結合されたパス
 */
export function joinPaths(...segments: string[]): string {
  return segments
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter((segment) => segment.length > 0)
    .join("/");
}
