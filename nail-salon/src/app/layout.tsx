import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingReserveButton } from "@/components/floating-reserve-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nabi nail",
  description: "nabi nailの公式サイト。メニュー・ご予約・ブログをご覧いただけます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          {children}
        </main>
        <Footer />
        <FloatingReserveButton />
      </body>
    </html>
  );
}
