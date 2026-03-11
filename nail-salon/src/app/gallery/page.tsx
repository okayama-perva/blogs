import type { Metadata } from "next";
import { getGallery, type GalleryItem } from "@/lib/microcms";

export const metadata: Metadata = {
  title: "ギャラリー | nabi nail",
  description: "nabi nailのネイルデザインギャラリー",
};

async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await getGallery();
    return res.contents;
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await fetchGallery();

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
                src={item.image.url}
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
