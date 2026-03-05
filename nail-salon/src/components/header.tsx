"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/menu", label: "メニュー" },
  { href: "/blog", label: "ブログ" },
  { href: "/reservation", label: "ご予約" },
  { href: "/contact", label: "お問い合わせ" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-pink-100">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 lg:px-8">
        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold tracking-wide text-pink-600">
          Nail Salon
        </Link>

        {/* PC ナビ */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-700 hover:text-pink-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ハンバーガーボタン */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー"
        >
          <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-opacity ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* モバイルメニュー */}
      {isOpen && (
        <nav className="md:hidden border-t border-pink-100 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
