export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Menu } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "メニュー | nabi nail",
  description: "nabi nailの施術メニュー・料金一覧",
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

  const grouped = menus.reduce<Record<string, Menu[]>>((acc, menu) => {
    const cat = menu.category || "その他";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(menu);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <>
      <section className="pt-16 pb-12 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] mb-4">Services</p>
        <h1 className="text-2xl sm:text-3xl font-extralight text-[var(--foreground)]">Menu</h1>
      </section>

      {menus.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-20 pb-20">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="text-sm tracking-[0.15em] text-[var(--accent)] mb-10 pb-3 border-b border-[var(--accent-light)]">
                {cat}
              </h2>
              <div className="space-y-8">
                {grouped[cat].map((menu) => (
                  <div key={menu.id} className="flex gap-5 sm:gap-8">
                    {/* 画像 */}
                    <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-[var(--gray-light)] overflow-hidden">
                      {menu.imageUrl ? (
                        <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-[11px]">No Image</div>
                      )}
                    </div>
                    {/* 情報 */}
                    <div className="flex-1 py-1">
                      <h3 className="text-[15px] text-[var(--foreground)]">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-[13px] text-[var(--muted)] mt-2 leading-relaxed">
                          {menu.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[15px] text-[var(--accent)] font-medium">
                          &yen;{menu.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[var(--muted)]">{menu.duration}min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--muted)] text-sm py-20">
          メニューは準備中です
        </p>
      )}
    </>
  );
}
