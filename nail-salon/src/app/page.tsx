import Link from "next/link";
import { getBlogs, type Blog } from "@/lib/microcms";
import { prisma } from "@/lib/prisma";
import type { Menu } from "@/generated/prisma/client";

async function fetchMenus(): Promise<Menu[]> {
  try {
    return await prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const res = await getBlogs({ limit: 3 });
    return res.contents;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [menus, blogs] = await Promise.all([fetchMenus(), fetchBlogs()]);

  return (
    <>
      {/* ヒーロー */}
      <section className="relative -mx-4 -mt-8 lg:-mx-8 min-h-[90vh] flex items-center">
        {/* 背景画像エリア */}
        <div className="absolute inset-0 bg-[var(--gray-light)]">
          {/* TODO: 本番画像に差し替え */}
          <img src="https://placehold.co/1920x1080/e8e0da/c4907c?text=Hero+Image" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[var(--background)]/60" />

        <div className="relative w-full px-6 lg:px-10 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-8">
            Nail Salon
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[var(--foreground)] leading-snug tracking-wide">
            あなたの指先に
            <br />
            <span className="text-[var(--accent)]">特別なひととき</span>を
          </h1>
          <p className="mt-8 text-sm sm:text-[15px] text-[var(--muted)] max-w-sm mx-auto leading-loose">
            丁寧なカウンセリングと確かな技術で、<br />
            理想のネイルを叶えます。
          </p>
          <Link
            href="/reservation"
            className="inline-block mt-12 text-sm tracking-[0.15em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
          >
            ご予約はこちら
          </Link>
        </div>
      </section>

      {/* Concept — 画像+テキスト横並び */}
      <section className="py-28 lg:py-36">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] text-center mb-4">Concept</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] text-center leading-relaxed mb-16 lg:mb-20">
          洗練された空間で、<br />あなただけの時間を。
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* 画像エリア */}
          <div className="aspect-[4/3] bg-[var(--gray-light)] overflow-hidden">
            {/* TODO: 本番画像に差し替え */}
            <img src="https://placehold.co/800x600/e8e0da/c4907c?text=Salon+Interior" alt="サロンの雰囲気" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm sm:text-[15px] text-[var(--muted)] leading-loose">
              当サロンは、お客様一人ひとりのライフスタイルに合わせたネイルデザインをご提案いたします。
            </p>
            <p className="text-sm sm:text-[15px] text-[var(--muted)] leading-loose mt-4">
              落ち着いた空間で、日常を忘れてリラックスしていただける時間をお届けします。
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-28 lg:py-36 -mx-4 lg:-mx-8 px-6 lg:px-10 bg-[var(--gray-light)]">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] text-center mb-4">Gallery</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] text-center mb-16 lg:mb-20">
          デザインギャラリー
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* TODO: 本番画像に差し替え */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white overflow-hidden">
              <img src={`https://placehold.co/400x400/e8e0da/c4907c?text=Nail+${i + 1}`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Staff */}
      <section className="py-28 lg:py-36">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] text-center mb-4">Staff</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] text-center mb-16 lg:mb-20">
          スタッフ紹介
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-16">
          {[
            { name: "田中 美咲", role: "Owner Nailist", description: "JNA1級取得。10年以上の経験を活かし、トレンドから上品なデザインまで幅広く対応いたします。" },
            { name: "鈴木 あかり", role: "Nailist", description: "ジェルアートが得意です。お客様のイメージを丁寧にヒアリングし、理想の指先をお届けします。" },
            { name: "佐藤 ゆい", role: "Nailist", description: "ケアを大切にした施術が特徴です。爪の健康を守りながら、美しい仕上がりを目指します。" },
          ].map((staff) => (
            <div key={staff.name} className="text-center">
              {/* TODO: 本番画像に差し替え */}
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[var(--gray-light)] mx-auto mb-6 overflow-hidden">
                <img src={`https://placehold.co/320x320/e8e0da/c4907c?text=${encodeURIComponent(staff.name)}`} alt={staff.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[15px] font-medium text-[var(--foreground)] tracking-wide">{staff.name}</p>
              <p className="text-[11px] tracking-[0.15em] text-[var(--accent)] mt-1">{staff.role}</p>
              <p className="text-sm text-[var(--muted)] mt-4 leading-loose">{staff.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="py-28 lg:py-36 -mx-4 lg:-mx-8 px-6 lg:px-10 bg-[var(--gray-light)]">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] text-center mb-4">Menu</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] text-center mb-16 lg:mb-20">
          施術メニュー
        </h2>
        {menus.length > 0 ? (
          <div className="max-w-xl mx-auto divide-y divide-[var(--accent-light)]">
            {menus.map((menu) => (
              <div key={menu.id} className="flex items-center justify-between py-6">
                <div>
                  <p className="text-[15px] text-[var(--foreground)]">{menu.name}</p>
                  <p className="text-[11px] text-[var(--muted)] mt-1">{menu.duration}min</p>
                </div>
                <p className="text-[15px] text-[var(--accent)] font-medium">
                  &yen;{menu.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--muted)] text-sm">メニューは準備中です</p>
        )}
        <div className="text-center mt-14">
          <Link
            href="/menu"
            className="text-sm tracking-[0.15em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
          >
            View All Menu
          </Link>
        </div>
      </section>

      {/* Blog */}
      <section className="py-28 lg:py-36">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] text-center mb-4">Journal</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] text-center mb-16 lg:mb-20">
          ブログ
        </h2>
        {blogs.length > 0 ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--gray-light)]">
                  {blog.eyecatch && (
                    <img
                      src={blog.eyecatch.url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[11px] text-[var(--muted)]">
                    {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
                  </p>
                  <h3 className="text-[15px] text-[var(--foreground)] mt-1 leading-relaxed group-hover:text-[var(--accent)] transition-colors duration-300">
                    {blog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--muted)] text-sm">記事は準備中です</p>
        )}
        <div className="text-center mt-14">
          <Link
            href="/blog"
            className="text-sm tracking-[0.15em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
          >
            View All Posts
          </Link>
        </div>
      </section>

      {/* Interior — サロン内観 */}
      <section className="py-28 lg:py-36 -mx-4 lg:-mx-8 px-6 lg:px-10 bg-[var(--gray-light)]">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] text-center mb-4">Interior</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] text-center mb-16 lg:mb-20">
          サロンのこだわり
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* TODO: 本番画像に差し替え */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/2] bg-white overflow-hidden">
              <img src={`https://placehold.co/720x480/e8e0da/c4907c?text=Interior+${i + 1}`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Access */}
      <section className="py-28 lg:py-36 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-4">Access</p>
        <h2 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] mb-12">
          サロン情報
        </h2>
        <div className="text-sm text-[var(--muted)] space-y-3 leading-loose">
          <p>〒000-0000 東京都○○区○○ 1-2-3</p>
          <p>TEL 03-0000-0000</p>
          <p>営業時間 10:00 - 20:00（不定休）</p>
        </div>
        <div className="mt-12">
          <Link
            href="/reservation"
            className="text-sm tracking-[0.15em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
          >
            Reserve
          </Link>
        </div>
      </section>
    </>
  );
}
