---
name: storybook-generator
description: 新規コンポーネント作成時にStorybookファイルを自動生成。「Storybookを作成」「Storybook追加」「○○コンポーネントのStoryを作って」などで起動。プロジェクト規約に従ったテンプレートを使用。
---

# Storybook Generator

新規Reactコンポーネント作成時に、プロジェクト規約に従ったStorybookファイル（`.stories.tsx`）を自動生成します。

## このSkillを使うタイミング

以下の場合にこのSkillを使用してください：

- 新しいReactコンポーネントを作成した後
- ユーザーが「Storybookを作成して」「Storyを追加して」と依頼した場合
- `src/components/` または `src/partials/` にコンポーネントを追加した場合

## プロジェクト規約

このプロジェクトでは以下の規約があります：

### ディレクトリ構造

```
src/components/ComponentName/
├── index.tsx                    # コンポーネント本体
└── ComponentName.stories.tsx    # Storybookファイル
```

### 命名規則

- **コンポーネントファイル**: `index.tsx`
- **Storybookファイル**: `{ComponentName}.stories.tsx`（コンポーネント名と同じ）

## Storybookファイルの基本構造

プロジェクトのStorybookファイルは以下のパターンに従います：

### シンプルなコンポーネント（推奨）

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentName } from ".";

const metaData: Meta = {
  title: "ComponentName",
  component: ComponentName,
};

export default metaData;

export const Default: StoryObj<typeof ComponentName> = {
  args: {
    // コンポーネントのpropsをここに記述
    // 例: prop1: "value1"
  },
};
```

### 複数バリエーションが必要な場合

追加のストーリーを定義できます：

```tsx
export const VariationName: StoryObj<typeof ComponentName> = {
  args: {
    // 異なるprops
  },
};

// モバイルビューなど、特定のビューポート用
export const Mobile: StoryObj<typeof ComponentName> = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    // props
  },
};
```

### カスタムレンダリングが必要な場合

```tsx
export const CustomRender: StoryObj<typeof ComponentName> = {
  args: {
    // props
  },
  render: (args) => {
    return (
      <div style={{ width: "320px" }}>
        <ComponentName {...args} />
      </div>
    );
  },
};
```

## 実行手順

1. **コンポーネントファイルを確認**
   - `index.tsx` を読み取り、コンポーネント名とpropsの型定義を取得

2. **Storybookファイルを生成**
   - コンポーネント名から `{ComponentName}.stories.tsx` を作成
   - propsの型定義から適切なデフォルト値を推測
   - テンプレート（`templates/basic.stories.tsx.template`）を使用

3. **生成内容の確認**
   - 生成したファイルをユーザーに提示
   - 必要に応じて調整を提案

## 重要な注意事項

- **型定義の確認**: コンポーネントのprops型を正確に読み取る
- **デフォルト値の推測**:
  - string型: 適切なサンプル文字列
  - number型: 妥当な数値
  - boolean型: false または true
  - 配列型: 1つ以上のサンプル要素を含む配列
  - オブジェクト型: 必要なフィールドを持つサンプルオブジェクト
- **import文の調整**: コンポーネントが外部の型を使用している場合、適切にimport

## テンプレートの場所

基本テンプレート: `templates/basic.stories.tsx.template`

## 実行後の確認

生成後、以下を確認してください：

1. Storybookサーバーで正しく表示されるか
   ```bash
   npm run storybook
   ```

2. 型エラーがないか
   ```bash
   npm run build-types
   ```

## 例

### 入力例1: シンプルなコンポーネント

```tsx
// src/components/Button/index.tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export const Button = (props: ButtonProps) => {
  return <button onClick={props.onClick} disabled={props.disabled}>{props.label}</button>;
};
```

### 出力例1

```tsx
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from ".";

const metaData: Meta = {
  title: "Button",
  component: Button,
};

export default metaData;

export const Default: StoryObj<typeof Button> = {
  args: {
    label: "Click me",
    onClick: () => console.log("clicked"),
    disabled: false,
  },
};
```

## トラブルシューティング

### 型エラーが発生する場合

- コンポーネントが使用している型を確認し、適切にimport
- 複雑な型（AstroのContentなど）の場合、`as unknown as` でキャスト

### Storybookで表示されない場合

- コンポーネント名が正しいか確認
- import文のパスが正しいか確認（`.` からの相対パス）
