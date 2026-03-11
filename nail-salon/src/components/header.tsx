"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/#access", label: "Access" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--gray-light)]">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="text-base font-light tracking-[0.2em] text-[var(--foreground)] uppercase">
          nabi nail
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] tracking-[0.08em] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー"
        >
          <div className="space-y-1.5">
            <span className={`block h-px w-5 bg-[var(--foreground)] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-px w-5 bg-[var(--foreground)] transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-[var(--foreground)] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </div>
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white border-t border-[var(--gray-light)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-4 text-sm tracking-[0.08em] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
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
