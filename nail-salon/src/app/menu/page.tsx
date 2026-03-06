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
      <section className="pt-16 pb-12 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-4">Services</p>
        <h1 className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">Menu</h1>
      </section>

      {menus.length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-16 pb-20">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="text-sm tracking-[0.15em] text-[var(--accent)] mb-8 pb-3 border-b border-[var(--accent-light)]">
                {cat}
              </h2>
              <div className="divide-y divide-[var(--accent-light)]">
                {grouped[cat].map((menu) => (
                  <div key={menu.id} className="py-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[15px] text-[var(--foreground)]">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                          {menu.description}
                        </p>
                      )}
                      <p className="text-[11px] text-[var(--muted)] mt-1">{menu.duration}min</p>
                    </div>
                    <p className="text-[15px] text-[var(--accent)] font-medium shrink-0">
                      &yen;{menu.price.toLocaleString()}
                    </p>
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
