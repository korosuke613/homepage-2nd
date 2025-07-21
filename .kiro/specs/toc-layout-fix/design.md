# 設計書

## 概要

この設計書では、ブログ投稿における目次（TOC）の表示とレイアウト問題を解決するための包括的なソリューションについて説明します。現在の実装では、デスクトップ画面で目次が固定位置に配置されており重複問題があり、モバイル画面では目次が完全に非表示になっています。

この設計は、要件定義書で特定された4つの主要要件に対応します：
1. **デスクトップでの重複防止**: メインコンテンツエリアとの重複を防ぎ、記事の読みやすさを確保
2. **モバイルでの目次表示**: モバイル画面でも目次機能を提供
3. **レスポンシブ対応**: 異なる画面サイズでの最適なレイアウト提供
4. **保守性**: 既存のデザインシステムとの一貫性を保ちながら実装

すべてのデバイスでメインコンテンツの読みやすさを妨げることなく、一貫したナビゲーション体験を提供するレスポンシブで保守可能なソリューションを提供します。

## アーキテクチャ

### 現在の実装分析

現在のTOC実装は以下の構造になっています：

```tsx
// src/components/Content.tsx
<div className="invisible fixed right-10 top-40 float-right max-w-[12%] lg:visible xl:max-w-xs">
  <Toc headings={props.headings} />
</div>
```

**問題点：**
- `fixed`ポジショニングによりメインコンテンツと重複する可能性
- `max-w-[12%]`（lg）から`xl:max-w-xs`（320px）への急激な幅変更
- lgブレークポイント（1024px）とxlブレークポイント（1280px）間での適切な配置調整なし

### 提案するアーキテクチャ

レスポンシブレイアウトシステムを採用し、以下の4つの画面幅範囲に対応：

1. **モバイル（< 768px）**: 折りたたみ可能なTOC表示
2. **タブレット（768px-1023px）**: インライン形式でのTOC表示
3. **lg-xl間（1024px-1279px）**: 適応的な固定配置
4. **xl以上（≥ 1280px）**: 最適化された固定配置

### モバイル対応戦略

**折りたたみ式TOC:**
- 記事上部に「目次」ボタンを配置
- クリック/タップで目次の表示/非表示を切り替え
- 目次は記事コンテンツの上部にインライン表示
- 目次項目クリック後は自動的に折りたたみ

## コンポーネントと インターフェース

### 修正対象コンポーネント

#### 1. Content.tsx
**主要な変更点:**
- モバイル・タブレット用のインライン目次追加
- デスクトップ用TOCコンテナのレスポンシブクラス修正
- 重複防止のための配置調整
- z-indexによる重なり順序の明示的制御

**現在の実装:**
```tsx
<div className="invisible fixed right-10 top-40 float-right max-w-[12%] lg:visible xl:max-w-xs">
  <Toc headings={props.headings} />
</div>
```

**提案する実装:**
```tsx
{/* モバイル・タブレット用インライン目次 */}
<div className="block lg:hidden mb-8">
  <MobileToc headings={props.headings} />
</div>

{/* デスクトップ用固定目次 */}
<div className="invisible lg:visible lg:fixed lg:right-4 lg:top-40 lg:max-w-[200px] lg:z-10 xl:right-10 xl:max-w-xs">
  <Toc headings={props.headings} />
</div>
```

#### 2. Toc.tsx
- 現在の実装は維持（変更不要）
- 既存のスタイリングと機能を保持
- リンク機能とナビゲーション動作は現状のまま

#### 3. MobileToc.tsx（新規作成）
**新しいコンポーネント:**
- モバイル・タブレット専用の目次コンポーネント
- 折りたたみ機能付きのインターフェース
- 既存のTocコンポーネントのロジックを再利用

**主要機能:**
```tsx
interface MobileTocProps {
  headings: MarkdownHeading[];
}

// 状態管理
const [isOpen, setIsOpen] = useState(false);

// 目次項目クリック時の自動折りたたみ
const handleItemClick = (href: string) => {
  setIsOpen(false);
  // ナビゲーション処理
};
```

### レスポンシブ戦略

#### ブレークポイント別対応

**モバイル（< 768px）:**
```css
/* インライン目次表示 */
block lg:hidden mb-8
```

**タブレット（768px-1023px）:**
```css
/* インライン目次表示（モバイルと同様） */
block lg:hidden mb-8
```

**lg（1024px-1279px）:**
```css
/* 重複防止のための適応的配置 */
lg:visible lg:fixed lg:right-4 lg:top-40 lg:max-w-[200px] lg:z-10
```

**xl（1280px以上）:**
```css
/* 最適化された固定配置 */
xl:right-10 xl:max-w-xs xl:z-auto
```

#### 要件対応の詳細

**要件1対応（デスクトップでの重複防止）:**
- `lg:right-4`により右端からの距離を調整し、メインコンテンツとの重複を防止
- `lg:max-w-[200px]`により適切な幅制限を設定
- `lg:z-10`により重なり順序を明示的に制御

**要件2対応（モバイルでの目次表示）:**
- `MobileToc`コンポーネントによる折りたたみ式目次
- `block lg:hidden`によりモバイル・タブレットでのみ表示
- インライン配置によりメインコンテンツとの重複を回避

**要件3対応（レスポンシブ動作）:**
- モバイル・タブレット: インライン目次表示
- lg-xl間: 適応的配置により重複を防止
- xl以上: 十分なスペース配分を確保

**要件4対応（保守性）:**
- 既存のTailwind CSSクラスパターンを使用
- 現在の視覚的スタイリングを維持
- 既存のTocコンポーネントロジックを再利用

## データモデル

既存のデータモデルを拡張します：

```typescript
// 既存のTocProps（変更なし）
type TocProps = {
  headings: MarkdownHeading[];
};

// 新しいMobileTocProps
type MobileTocProps = {
  headings: MarkdownHeading[];
};

// MobileTocの内部状態
type MobileTocState = {
  isOpen: boolean;
};

// MarkdownHeading型（参考）
type MarkdownHeading = {
  depth: number;
  slug: string;
  text: string;
};
```

## エラーハンドリング

### 重複検出と回避

1. **CSS層での制御**
   - `z-index`による重なり順制御
   - 適切な`max-width`設定による幅制限

2. **レスポンシブ境界での動作**
   - ブレークポイント間での滑らかな遷移
   - コンテンツ幅に応じた動的調整

### フォールバック戦略

- TOCが表示できない場合は非表示を維持
- メインコンテンツの可読性を最優先

## テスト戦略

### ビジュアルリグレッションテスト

既存のVRTシステムを活用：

1. **ブレークポイント別スナップショット**
   - モバイル: 375px幅でのインライン目次表示確認
   - タブレット: 768px幅でのインライン目次表示確認
   - lg: 1024px幅でのTOC配置確認
   - xl: 1280px幅での最適配置確認
   - 2xl: 1536px幅での余裕のある配置確認

2. **重複検証テスト**
   - メインコンテンツとTOCの重複がないことを確認
   - 各ブレークポイントでの適切な配置を検証

3. **モバイル目次機能テスト**
   - 折りたたみ状態のスナップショット
   - 展開状態のスナップショット
   - 目次項目クリック後の自動折りたたみ確認

### コンポーネントテスト

Playwrightを使用したコンポーネントテスト：

```typescript
// 提案するテストケース

// モバイル目次テスト
test('Mobile TOC should be visible and functional on mobile screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // インライン目次の表示確認
  // 折りたたみ機能の動作確認
});

test('Mobile TOC should toggle correctly', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // 目次ボタンクリックでの表示/非表示切り替え確認
  // 目次項目クリック後の自動折りたたみ確認
});

// デスクトップ目次テスト
test('TOC should not overlap with main content on lg screens', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  // TOCとメインコンテンツの位置関係を検証
});

test('TOC should be properly positioned on xl screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 768 });
  // 最適化された配置を検証
});

// レスポンシブ動作テスト
test('TOC should switch between mobile and desktop versions correctly', async ({ page }) => {
  // ビューポートサイズ変更時の動作確認
});
```

## 設計決定と根拠

### 1. 固定ポジショニングの維持

**決定:** `position: fixed`を維持
**根拠:** 
- スクロール時のTOC可視性維持
- 既存のユーザー体験との一貫性
- 実装の複雑さを最小限に抑制

### 2. 段階的な幅調整

**決定:** lg-xl間で段階的な`max-width`調整
**根拠:**
- 急激な幅変更による視覚的不整合の回避
- 各ブレークポイントでの最適な可読性確保
- Tailwindのユーティリティクラスとの整合性

### 3. z-indexによる重なり制御

**決定:** lgブレークポイントで`z-index`を明示的に設定
**根拠:**
- メインコンテンツとの重複を確実に防止
- 他のUI要素との適切な重なり順序維持
- デバッグとメンテナンスの容易さ

### 4. 既存スタイルの保持

**決定:** 既存のTOCコンポーネント自体のスタイルは変更しない
**根拠:**
- 既存のデザインシステムとの一貫性維持
- 変更範囲の最小化によるリスク軽減
- 将来的な拡張性の確保

### 5. モバイル目次の実装方式

**決定:** 折りたたみ式インライン目次を採用
**根拠:**
- メインコンテンツとの重複を完全に回避
- モバイルでの直感的な操作性
- 既存のコンポーネントロジックの再利用可能性
- 実装の複雑さを最小限に抑制

## 実装上の考慮事項

### Tailwind CSSクラスの最適化

現在のクラス構成：
```css
invisible fixed right-10 top-40 float-right max-w-[12%] lg:visible xl:max-w-xs
```

提案する新しいクラス構成：
```css
invisible lg:visible lg:fixed lg:right-4 lg:top-40 lg:max-w-[200px] lg:z-10 xl:right-10 xl:max-w-xs
```

### パフォーマンスへの影響

- CSS変更のみのため、JavaScriptパフォーマンスへの影響なし
- レンダリング性能への影響は最小限
- 既存のレスポンシブシステムとの整合性維持

### ブラウザ互換性

- 使用するCSSプロパティは全て標準的なもの
- Tailwind CSSのブラウザサポート範囲内
- 既存の実装と同等の互換性を維持
