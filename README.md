# 絶対リーチSMS API検証サイト

絶対リーチSMS Communication Platformのサービスを利用したSMS送信機能を検証するためのプロジェクトです。

## 概要

本プロジェクトは、会員管理システムにおけるSMS活用例を検証するためのサンプルサイトです。絶対リーチSMSのAPIを利用して、以下の機能を提供しています：

- SMS個別送信機能
- SMS一斉送信機能
- 送信ステータス確認機能
- 配信状況のリアルタイム確認

## 技術スタック

- **フレームワーク**: [Next.js 14](https://nextjs.org/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **フォーム管理**: [React Hook Form](https://react-hook-form.com/)
- **バリデーション**: [Zod](https://zod.dev/)
- **通知**: [Sonner](https://sonner.emilkowal.ski/)

## 環境構築

### 前提条件

- Node.js 18.x以上
- npm 9.x以上または対応するyarn/pnpm

### インストール手順

1. リポジトリをクローン

```bash
git clone https://github.com/your-username/zettai-reach-poc.git
cd zettai-reach-poc
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定

`.env.local.default`を`.env.local`としてコピーし、適切な値を設定します：

```bash
cp .env.local.default .env.local
```

`.env.local`ファイルを編集して、以下の項目を設定してください：

```
ZETTAI_REACH_TOKEN=<あなたのAPIトークン>
ZETTAI_REACH_CLIENT_ID=<あなたのクライアントID>
ZETTAI_REACH_SMS_CODE=<あなたのSMSコード>
ZETTAI_REACH_API_ENDPOINT=https://sms-api.aossms.com
```

4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスして開発サーバーが起動していることを確認してください。

## 機能説明

### SMS個別送信

1. トップページから「SMS一斉送信機能」を選択
2. 「個別送信」タブを選択
3. 送信先電話番号とメッセージを入力
4. 「送信」ボタンをクリック
5. 送信結果が表示されます
6. 「ステータス確認」ボタンをクリックして配信状況を確認できます

### SMS一斉送信

1. トップページから「SMS一斉送信機能」を選択
2. 「一斉送信」タブを選択
3. テキスト入力で複数の電話番号を入力するか、CSVファイルをアップロード
4. メッセージとグループタグを入力
5. 「一斉送信」ボタンをクリック
6. 送信状況と結果が表示されます
7. 「ステータス確認」ボタンをクリックして配信状況を確認できます

## ディレクトリ構成

```
/
├── public/                  # 静的ファイル
├── src/
│   ├── app/                 # Nextアプリケーション
│   │   ├── api/             # APIルート
│   │   │   └── sms/         # SMS関連のAPIエンドポイント
│   │   ├── features/        # 機能別ページ
│   │   └── layout.tsx       # レイアウトコンポーネント
│   ├── components/          # UIコンポーネント
│   │   ├── sms/             # SMS関連のコンポーネント
│   │   └── ui/              # 汎用UIコンポーネント
│   └── lib/                 # ユーティリティと共通ロジック
└── docs/                    # ドキュメント
```

## APIエンドポイント

- `POST /api/sms/send` - SMS個別送信API
- `GET /api/sms/status` - SMS配信状況確認API
- `POST /api/sms/batch-send` - SMS一斉送信API
- `GET /api/sms/batch-status` - 一斉送信ステータス確認API

## 注意事項

- 本プロジェクトは検証用です。実運用環境で使用する場合は、エラー処理やセキュリティ対策をさらに強化してください。
- APIキーは`.env.local`ファイルに保存し、リポジトリにコミットしないでください。
- SMS送信にはコストが発生する場合があります。テスト時は少数の送信先で確認することをお勧めします。

## 開発者情報

このプロジェクトは、zenシステム開発チームによって作成されました。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。
