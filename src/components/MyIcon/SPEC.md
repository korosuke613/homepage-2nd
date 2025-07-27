# MyIcon Component Specification

## 概要
MyIconは、インタラクティブなアバター画像コンポーネントです。クリック操作、キーボードコマンド、様々な動作モードに対応した高機能なコンポーネントです。

## Props
- `iconPath: string` - アイコン画像のパス
- `iconId: string` - アイコンのDOM ID

## 基本機能

### 1. 回転アニメーション
- **トリガー**: マウスクリックまたは自動実行
- **アニメーション種類**: 7種類のランダム回転（X軸、Y軸、Z軸の組み合わせ）
- **実行時間**: 1.5秒
- **効果**: 回転中にスケールも変化（1.0 → 1.5 → 1.0）

### 2. カラーフィルター
- **対象**: 移動モード中のアイコン
- **色変化**: 13種類のビビッドカラー（壁衝突時に変更）
- **適用**: `hue-rotate`、`saturate(400%)`、`brightness(1.2)`

## キーボードコマンド

### 基本コマンド
| コマンド | キーワード | 機能 |
|---------|-----------|------|
| No Limit Mode | `mugen` | 回転制限を解除 |
| Infinity Mode | `eien` | 自動回転を開始 |
| Clock Up | `clockup`/`cu` | 速度とインターバルを加速 |
| DVD Mode | `kakku` | DVD風の跳ね返り移動を開始 |
| Chase Mode | `oikake` | マウス追跡/回避モードを切り替え |

### コマンド入力仕様
- **バッファサイズ**: 10文字（超過分は古い文字を削除）
- **大小文字**: 区別なし
- **アクティブ条件**: アイコンが表示状態である必要あり

## 移動モード

### 1. DVD Mode (`kakku`)
- **動作**: 画面端で跳ね返りながら移動
- **速度**: 初期値5px/frame（Clock Upで加速可能）
- **衝突**: 壁に当たると方向転換＋色変更
- **フレームレート**: 60fps

### 2. Chase Mode (`oikake`)
- **3つのサブモード**:
  - `none`: 無効状態
  - `follow`: マウスに向かって移動
  - `avoid`: マウスから逃げるように移動
- **切り替え**: `oikake`キーで循環切り替え
- **速度**: 初期値5px/frame（Clock Upで加速可能）
- **最小距離**: 50px（振動防止）
- **壁衝突**: 跳ね返らず壁で停止

### 移動モード相互排他制御
- Chase Mode有効時: DVD Mode自動停止
- DVD Mode有効時: Chase Mode有効化でDVD Mode自動停止
- Chase Mode無効時: 移動も自動停止

## 速度制御

### Clock Up機能
- **加速率**: インターバル×0.8、移動速度×1.2
- **最小インターバル**: 100ms
- **適用対象**: 自動回転間隔、移動速度（DVD Mode/Chase Mode共通）

### 距離計算最適化
- **Chase Mode**: 効率的なベクトル計算
- **近距離処理**: 
  - Follow: 減速して停止
  - Avoid: 一定速度で逃避、重複時はランダム方向

## 状態管理

### State変数
- `rotationComplete`: 回転アニメーション完了フラグ
- `isNoLimit`: 回転制限解除フラグ
- `isInfinite`: 無限回転フラグ
- `keyString`: キー入力バッファ
- `intervalTime`: 自動回転間隔
- `isMoving`: 移動モードフラグ
- `position`: 位置と速度ベクトル
- `iconColor`: 現在のカラーインデックス
- `moveSpeed`: 移動速度
- `chaseMode`: 追跡モード状態
- `mousePositionRef`: マウス位置参照

### イベントリスナー
- `keydown`: コマンド入力処理
- `mousemove`: Chase Mode用マウス追跡
- `resize`: ウィンドウリサイズ対応

## レスポンシブ対応
- **ウィンドウリサイズ**: アイコン位置を画面内に自動調整
- **初期サイズ記録**: 移動時のサイズ維持

## パフォーマンス考慮事項
- **アニメーション**: `requestAnimationFrame`ベースの60fps更新
- **メモリ管理**: useCallbackによる関数メモ化
- **イベント管理**: 適切なクリーンアップ処理

## デバッグ機能
- **コンソールログ**: 各モード切り替えでカラフルな大型ログ出力
- **状態表示**: Clock Up時の詳細パラメータ表示

## 技術的制約
- **DOM依存**: document.getElementById使用（SSR考慮必要）
- **ブラウザAPI**: Web Animations API使用
- **位置計算**: getBoundingClientRect依存