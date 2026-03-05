import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-pink-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* サロン情報 */}
          <div>
            <h3 className="text-sm font-bold text-pink-600 mb-3">Nail Salon</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              〒000-0000 東京都○○区○○ 1-2-3<br />
              TEL: 03-0000-0000<br />
              営業時間: 10:00〜20:00（不定休）
            </p>
          </div>

          {/* ナビ */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">メニュー</h3>
            <ul className="space-y-2">
              {[
                { href: "/menu", label: "施術メニュー" },
                { href: "/blog", label: "ブログ" },
                { href: "/reservation", label: "ご予約" },
                { href: "/contact", label: "お問い合わせ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-gray-500 hover:text-pink-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SNS */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">SNS</h3>
            <p className="text-xs text-gray-500">Instagram / LINE（準備中）</p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Nail Salon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
