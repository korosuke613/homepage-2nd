# 設計書

## 概要

この設計書では、ブログ投稿のデスクトップ画面における目次（TOC）の重複問題を解決するためのレイアウト修正について説明します。現在の実装では、目次が固定位置（`fixed right-10 top-40`）に配置されており、ビューポートの幅が不十分な場合にメインコンテンツと重複する問題があります。

この設計は、要件定義書で特定された3つの主要要件に対応します：
1. **重複防止**: メインコンテンツエリアとの重複を防ぎ、記事の読みやすさを確保
2. **レスポンシブ対応**: 異なる画面サイズでの最適なレイアウト提供
3. **保守性**: 既存のデザインシステムとの一貫性を保ちながら実装

メインコンテンツの読みやすさを妨げることなく、レスポンシブで保守可能なソリューションを提供します。

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

レスポンシブレイアウトシステムを採用し、以下の3つの画面幅範囲に対応：

1. **lg未満（< 1024px）**: TOC非表示（現在の動作を維持）
2. **lg-xl間（1024px-1279px）**: 適応的配置
3. **xl以上（≥ 1280px）**: 最適化された固定配置

## コンポーネントと インターフェース

### 修正対象コンポーネント

#### 1. Content.tsx
**主要な変更点:**
- TOCコンテナのレスポンシブクラス修正
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
<div className="invisible lg:visible lg:fixed lg:right-4 lg:top-40 lg:max-w-[200px] lg:z-10 xl:right-10 xl:max-w-xs">
  <Toc headings={props.headings} />
</div>
```

#### 2. Toc.tsx
- 現在の実装は維持（変更不要）
- 既存のスタイリングと機能を保持
- リンク機能とナビゲーション動作は現状のまま

### レスポンシブ戦略

#### ブレークポイント別対応

**lg未満（< 1024px）:**
```css
invisible /* 現在の動作を維持 - TOC非表示 */
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

**要件1対応（重複防止）:**
- `lg:right-4`により右端からの距離を調整し、メインコンテンツとの重複を防止
- `lg:max-w-[200px]`により適切な幅制限を設定
- `lg:z-10`により重なり順序を明示的に制御

**要件2対応（レスポンシブ動作）:**
- lg未満では`invisible`によりTOC非表示を維持
- lg-xl間では適応的配置により重複を防止
- xl以上では十分なスペース配分を確保

**要件3対応（保守性）:**
- 既存のTailwind CSSクラスパターンを使用
- 現在の視覚的スタイリングを維持
- モバイル・タブレット動作に影響なし

## データモデル

既存のデータモデルに変更はありません：

```typescript
type TocProps = {
  headings: MarkdownHeading[];
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
   - lg: 1024px幅でのTOC配置確認
   - xl: 1280px幅での最適配置確認
   - 2xl: 1536px幅での余裕のある配置確認

2. **重複検証テスト**
   - メインコンテンツとTOCの重複がないことを確認
   - 各ブレークポイントでの適切な配置を検証

### コンポーネントテスト

Playwrightを使用したコンポーネントテスト：

```typescript
// 提案するテストケース
test('TOC should not overlap with main content on lg screens', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  // TOCとメインコンテンツの位置関係を検証
});

test('TOC should be properly positioned on xl screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 768 });
  // 最適化された配置を検証
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

**決定:** TOCコンポーネント自体のスタイルは変更しない
**根拠:**
- 既存のデザインシステムとの一貫性維持
- 変更範囲の最小化によるリスク軽減
- 将来的な拡張性の確保

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
