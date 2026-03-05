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
      <section className="relative -mx-4 -mt-8 lg:-mx-8 px-4 py-24 sm:py-32 bg-gradient-to-br from-pink-50 to-rose-100 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
          あなたの指先に<br className="sm:hidden" />
          <span className="text-pink-500">特別なひとときを</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          丁寧なカウンセリングと確かな技術で、理想のネイルを叶えます。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/reservation"
            className="inline-block rounded-full bg-pink-500 px-8 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
          >
            ご予約はこちら
          </Link>
          <Link
            href="/menu"
            className="inline-block rounded-full border border-pink-300 px-8 py-3 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
          >
            メニューを見る
          </Link>
        </div>
      </section>

      {/* サロン紹介 */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Concept</h2>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mb-6" />
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
          当サロンは、お客様一人ひとりのライフスタイルに合わせたネイルデザインをご提案いたします。
          落ち着いた空間で、日常を忘れてリラックスしていただける時間をお届けします。
        </p>
      </section>

      {/* メニュー抜粋 */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Menu</h2>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mb-10" />
        {menus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu.id} className="rounded-xl border border-pink-100 p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800">{menu.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{menu.duration}分</p>
                <p className="text-pink-500 font-bold mt-2">&yen;{menu.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">メニューは準備中です</p>
        )}
        <div className="text-center mt-8">
          <Link href="/menu" className="text-sm text-pink-500 hover:underline">
            メニュー一覧を見る →
          </Link>
        </div>
      </section>

      {/* ブログ抜粋 */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Blog</h2>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mb-10" />
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.id}`} className="group block rounded-xl border border-pink-100 overflow-hidden hover:shadow-md transition-shadow">
                {blog.eyecatch && (
                  <img
                    src={blog.eyecatch.url}
                    alt={blog.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-400">{new Date(blog.publishedAt).toLocaleDateString("ja-JP")}</p>
                  <h3 className="font-semibold text-gray-800 mt-1 group-hover:text-pink-500 transition-colors">{blog.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">記事は準備中です</p>
        )}
        <div className="text-center mt-8">
          <Link href="/blog" className="text-sm text-pink-500 hover:underline">
            ブログ一覧を見る →
          </Link>
        </div>
      </section>

      {/* アクセス・営業情報 */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access</h2>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mb-6" />
        <div className="text-sm text-gray-600 space-y-2">
          <p>〒000-0000 東京都○○区○○ 1-2-3</p>
          <p>TEL: 03-0000-0000</p>
          <p>営業時間: 10:00〜20:00（不定休）</p>
        </div>
      </section>
    </>
  );
}
