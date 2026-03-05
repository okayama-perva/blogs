---
name: coding-conventions
description: nail-salonプロジェクトのコーディング規約
---
# コーディング規約

## コンポーネント
- 関数コンポーネント + TypeScript
- ファイル名: kebab-case (例: `reservation-form.tsx`)
- export default は使わず named export

## スタイリング
- Tailwind CSS v4 のユーティリティクラスのみ
- ブレークポイント: `sm:` (スマホ以上), `md:` (タブレット以上), `lg:` (PC)
- モバイルファースト

## ディレクトリ
- `src/app/` — ページ (App Router)
- `src/components/` — 共有コンポーネント
- `src/lib/` — ユーティリティ・API関数

## データ取得
- Server Components でデータフェッチ
- Client Components は `"use client"` を明示
- microCMS: `src/lib/microcms.ts` の関数を使用
- DB: `src/lib/prisma.ts` のクライアントを使用
