# サイトマップ

| ページ | パス | データソース | 状態 |
|---|---|---|---|
| トップ | `/` | Prisma (Menu) + microCMS (blogs) | 完了 |
| メニュー表 | `/menu` | Prisma (Menu) | 完了 |
| 予約 | `/reservation` | Prisma (Menu, Reservation) | 完了 |
| ギャラリー | `/gallery` | microCMS (gallery) | 完了 |
| ブログ一覧 | `/blog` | microCMS (blogs) | 完了 |
| ブログ詳細 | `/blog/[id]` | microCMS (blogs) | 完了 |
| コンタクト | `/contact` | - (Server Action) | 完了 |
| 管理ログイン | `/admin` | NextAuth | 完了 |
| 予約管理 | `/admin/dashboard` | Prisma (Reservation) | 完了 |
| メニュー管理 | `/admin/menu` | Prisma (Menu) | 完了 |

## API
| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth認証 |
| `/api/admin/reservations` | PATCH | 予約ステータス更新 |
| `/api/admin/menu` | GET/POST/PATCH/DELETE | メニューCRUD |
| `/api/reservations/available` | GET | 特定日の空き時間枠取得 |
