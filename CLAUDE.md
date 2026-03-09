# nail-salon プロジェクト

## 技術スタック
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma (MySQL) — 予約・管理者・メニュー
- microCMS — ブログ・ギャラリー
- NextAuth — 管理画面認証

## サイトマップ
→ `.claude/sitemap.md` を参照

## レスポンシブ対応
- PC / タブレット / スマホ の3ブレークポイント
- モバイルファースト設計

## DB設計 (Prisma)
- Reservation: 予約 (顧客名, メール, 電話, メニュー, 日時, ステータス)
- Menu: メニュー (名前, 説明, 料金, 施術時間, カテゴリ, 画像URL, 有効/無効, 表示順)
- Admin: 管理者 (メール, パスワード, 名前)

## microCMS コンテンツ
- toppage: トップページ
- blogs: ブログ記事 (タイトル, 本文, アイキャッチ, カテゴリ)
- gallery: ギャラリー (画像, キャプション, タグ)

## コマンド
- `npm run dev` / `npm run build` / `npm run lint`
- `npx prisma generate` / `npx prisma db push`

## .claude/ リファレンス
- サイトマップ → `.claude/sitemap.md`
- コーディング規約 → `.claude/skills/coding-conventions/SKILL.md`
- `/review <ファイル>` — コードレビュー
- `/page <ページ名>` — ページ作成ガイド

## ソースリファレンス
- DB設計 → `prisma/schema.prisma`
- microCMS型定義 → `src/lib/microcms.ts`
- Prismaクライアント → `src/lib/prisma.ts`

## ルール
- 簡潔に回答。説明は最小限。
- ファイル変更は要求された箇所のみ。
- コミット前に必ず確認を取る。
- 必要な情報があれば `.claude/` 内のファイルを参照する。

## ドキュメント自動更新ルール
以下のタイミングで対応するファイルを更新すること：
- ページ追加・削除・パス変更 → `.claude/sitemap.md`
- microCMSエンドポイント追加 → `CLAUDE.md` の microCMS コンテンツ
- Prismaモデル追加・変更 → `CLAUDE.md` の DB設計
- 新しい共有コンポーネント作成 → `.claude/skills/coding-conventions/SKILL.md` のディレクトリ欄
- npm依存パッケージ追加 → `CLAUDE.md` の技術スタック (主要なもののみ)
- カスタムコマンド追加 → `CLAUDE.md` の .claude/ リファレンス
- 判断に迷う設計決定 → `.claude/` 内に決定記録ファイルを作成
