"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingReserveButton() {
  const pathname = usePathname();

  // 予約ページ・管理画面では非表示
  if (pathname.startsWith("/reservation") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      href="/reservation"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--foreground)] text-white px-6 py-3.5 text-sm tracking-[0.12em] shadow-lg hover:bg-[var(--accent)] transition-colors duration-300 sm:bottom-8 sm:right-8"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      予約する
    </Link>
  );
}
