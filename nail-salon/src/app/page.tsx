export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBlogs, type Blog } from "@/lib/microcms";
import { prisma } from "@/lib/prisma";
import type { Menu } from "@/generated/prisma/client";
import ImageSlider from "@/components/image-slider";

async function fetchMenus(): Promise<Menu[]> {
  try {
    return await prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

async function fetchPickupBlog(): Promise<Blog | null> {
  try {
    const res = await getBlogs({ filters: "pickup[equals]true", limit: 1 });
    return res.contents[0] ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [menus, pickupBlog] = await Promise.all([fetchMenus(), fetchPickupBlog()]);

  return (
    <>
      {/* ヒーロー — 全幅・大きな写真 */}
      <section className="relative -mx-4 -mt-8 lg:-mx-8 min-h-[100vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="https://placehold.co/1920x1080/f5f0eb/b8967a?text=Hero" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative text-center px-6">
          <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] mb-6">
            Nail Salon
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight text-[var(--foreground)] leading-snug tracking-wider">
            あなたの指先に
            <br />
            <span className="text-[var(--accent)]">特別なひととき</span>を
          </h1>
          <p className="mt-8 text-[13px] sm:text-sm text-[var(--muted)] max-w-md mx-auto leading-[2]">
            丁寧なカウンセリングと確かな技術で、
            <br />
            理想のネイルを叶えます。
          </p>
        </div>
      </section>

      {/* Concept */}
      <section className="py-28 lg:py-36">
        <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] text-center mb-4">Concept</p>
        <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--foreground)] text-center leading-relaxed mb-16 lg:mb-20">
          洗練された空間で、<br />あなただけの時間を。
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ImageSlider
            images={[
              { src: "https://placehold.co/800x600/f5f0eb/b8967a?text=Salon+1", alt: "サロンの雰囲気 1" },
              { src: "https://placehold.co/800x600/ebe5de/a68b6b?text=Salon+2", alt: "サロンの雰囲気 2" },
              { src: "https://placehold.co/800x600/e0d8cf/9c7f5c?text=Salon+3", alt: "サロンの雰囲気 3" },
            ]}
          />
          <div>
            <p className="text-[13px] sm:text-sm text-[var(--muted)] leading-[2]">
              当サロンは、お客様一人ひとりのライフスタイルに合わせたネイルデザインをご提案いたします。
            </p>
            <p className="text-[13px] sm:text-sm text-[var(--muted)] leading-[2] mt-4">
              落ち着いた空間で、日常を忘れてリラックスしていただける時間をお届けします。
            </p>
          </div>
        </div>
      </section>

      {/* Gallery — 大きな写真グリッド */}
      <section id="gallery" className="py-28 lg:py-36 -mx-4 lg:-mx-8 px-6 lg:px-10 bg-[var(--gray-light)] scroll-mt-20">
        <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] text-center mb-4">Gallery</p>
        <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--foreground)] text-center mb-16 lg:mb-20">
          デザインギャラリー
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square overflow-hidden group">
              <img
                src={`https://placehold.co/600x600/f5f0eb/b8967a?text=Nail+${i + 1}`}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Menu — 画像付き */}
      <section className="py-28 lg:py-36">
        <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] text-center mb-4">Menu</p>
        <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--foreground)] text-center mb-16 lg:mb-20">
          施術メニュー
        </h2>
        {menus.length > 0 ? (
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {menus.map((menu) => (
              <div key={menu.id} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-[var(--gray-light)]">
                  {menu.imageUrl ? (
                    <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">No Image</div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[15px] text-[var(--foreground)]">{menu.name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[13px] text-[var(--accent)]">&yen;{menu.price.toLocaleString()}</span>
                    <span className="text-[11px] text-[var(--muted)]">{menu.duration}min</span>
                  </div>
                </div>
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

      {/* Blog — ピックアップ1記事 */}
      <section className="py-28 lg:py-36 -mx-4 lg:-mx-8 px-6 lg:px-10 bg-[var(--gray-light)]">
        <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] text-center mb-4">Journal</p>
        <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--foreground)] text-center mb-16 lg:mb-20">
          ブログ
        </h2>
        {pickupBlog ? (
          <Link href={`/blog/${pickupBlog.id}`} className="group block max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/3] overflow-hidden bg-white">
                {pickupBlog.eyecatch && (
                  <img src={pickupBlog.eyecatch.url} alt={pickupBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
              <div>
                <p className="text-[11px] text-[var(--muted)]">
                  {new Date(pickupBlog.publishedAt).toLocaleDateString("ja-JP")}
                </p>
                <h3 className="text-[18px] sm:text-xl font-light text-[var(--foreground)] mt-2 leading-relaxed group-hover:text-[var(--accent)] transition-colors duration-300">
                  {pickupBlog.title}
                </h3>
              </div>
            </div>
          </Link>
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

      {/* Access — 詳細セクション */}
      <section id="access" className="py-28 lg:py-36 scroll-mt-20">
        <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] text-center mb-4">Access</p>
        <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--foreground)] text-center mb-16 lg:mb-20">
          アクセス
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* 地図 */}
          <div className="aspect-[4/3] bg-[var(--gray-light)] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.828030555!2d139.7671!3d35.6812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQwJzUyLjMiTiAxMznCsDQ2JzAxLjYiRQ!5e0!3m2!1sja!2sjp!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="サロンの場所"
            />
          </div>
          {/* 詳細情報 */}
          <div className="flex flex-col justify-center">
            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1">住所</dt>
                <dd className="text-[var(--foreground)] leading-relaxed">
                  〒000-0000<br />東京都○○区○○ 1-2-3<br />○○ビル 3F
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1">最寄り駅</dt>
                <dd className="text-[var(--foreground)] leading-relaxed">
                  ○○線「○○駅」徒歩3分<br />
                  ○○線「○○駅」徒歩5分
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1">電話番号</dt>
                <dd className="text-[var(--foreground)]">03-0000-0000</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1">営業時間</dt>
                <dd className="text-[var(--foreground)] leading-relaxed">
                  10:00 - 20:00（最終受付 19:00）<br />
                  不定休
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1">お支払い方法</dt>
                <dd className="text-[var(--foreground)]">現金 / クレジットカード / PayPay</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
