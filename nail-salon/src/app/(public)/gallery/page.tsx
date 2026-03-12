export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "ギャラリー | nabi nail",
  description: "nabi nailのネイルデザインギャラリー",
};

export default async function GalleryPage() {
  let items: { id: number; fileName: string; caption: string | null }[] = [];
  try {
    items = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, fileName: true, caption: true },
    });
  } catch {
    items = [];
  }

  return (
    <>
      <section className="pt-16 pb-12 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-4">Gallery</p>
        <h1 className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">デザインギャラリー</h1>
      </section>

      {items.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 pb-20">
          {items.map((item) => (
            <div key={item.id} className="aspect-square overflow-hidden group">
              <img
                src={`/uploads/gallery/${item.fileName}`}
                alt={item.caption || ""}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--muted)] text-sm py-20">
          ギャラリーは準備中です
        </p>
      )}
    </>
  );
}
