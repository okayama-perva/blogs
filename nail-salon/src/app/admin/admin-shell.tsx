"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/dashboard", label: "予約管理" },
  { href: "/admin/menu", label: "メニュー管理" },
  { href: "/admin/blocked", label: "予約ブロック" },
  { href: "/admin/gallery", label: "ギャラリー" },
  { href: "/admin/slider", label: "スライダー" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  // ログインページはシェルなし
  if (pathname === "/admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-sm px-4">{children}</div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-gray-800 tracking-wide">nabi nail 管理</span>
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              サイトを表示
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
        {/* モバイルナビ */}
        <nav className="sm:hidden flex border-t border-gray-100">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 text-center py-2.5 text-xs transition-colors ${
                  active
                    ? "text-gray-900 font-medium border-b-2 border-gray-800"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* コンテンツ */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
