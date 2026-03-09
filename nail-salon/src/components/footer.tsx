import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--gray-light)] mt-20">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-[15px] font-light tracking-[0.2em] text-[var(--foreground)] mb-4 uppercase">
              Nail Salon
            </p>
            <div className="text-[13px] text-[var(--muted)] leading-loose space-y-1">
              <p>〒000-0000 東京都○○区○○ 1-2-3</p>
              <p>TEL 03-0000-0000</p>
              <p>10:00 - 20:00（不定休）</p>
            </div>
          </div>

          <div>
            <p className="text-[13px] tracking-[0.15em] text-[var(--muted)] mb-4">Pages</p>
            <ul className="space-y-3">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/#gallery", label: "Gallery" },
                { href: "/blog", label: "Blog" },
                { href: "/#access", label: "Access" },
                { href: "/reservation", label: "Reserve" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] tracking-[0.15em] text-[var(--muted)] mb-4">Follow</p>
            <p className="text-[13px] text-[var(--muted)]">Instagram / LINE</p>
          </div>
        </div>

        <p className="mt-16 text-center text-[11px] tracking-[0.1em] text-[var(--muted)]/50">
          &copy; {new Date().getFullYear()} Nail Salon
        </p>
      </div>
    </footer>
  );
}
