import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Menu } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "メニュー | Nail Salon",
  description: "ネイルサロンの施術メニュー・料金一覧",
};

async function fetchMenus(): Promise<Menu[]> {
  try {
    return await prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function MenuPage() {
  const menus = await fetchMenus();

  // カテゴリ別にグループ化
  const grouped = menus.reduce<Record<string, Menu[]>>((acc, menu) => {
    const cat = menu.category || "その他";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(menu);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <>
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Menu</h1>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mt-4" />
      </section>

      {menus.length > 0 ? (
        <div className="space-y-12 pb-16">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="text-lg font-bold text-pink-500 mb-6 border-b border-pink-100 pb-2">
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[cat].map((menu) => (
                  <div
                    key={menu.id}
                    className="rounded-xl border border-pink-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          {menu.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-pink-500 font-bold">
                          &yen;{menu.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">{menu.duration}分</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-16">
          メニューは準備中です
        </p>
      )}
    </>
  );
}
