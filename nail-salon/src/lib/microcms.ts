import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// ===========================
// 型定義
// ===========================

export type Blog = {
  id: string;
  title: string;
  content: string;
  eyecatch?: { url: string; width: number; height: number };
  category?: { id: string; name: string };
  publishedAt: string;
  revisedAt: string;
};

export type GalleryItem = {
  id: string;
  image: { url: string; width: number; height: number };
  caption?: string;
  tags?: string;
};

// ===========================
// APIフェッチ関数
// ===========================

export async function getBlogs(queries?: object) {
  return client.getList<Blog>({ endpoint: "blogs", queries });
}

export async function getBlog(id: string) {
  return client.getListDetail<Blog>({ endpoint: "blogs", contentId: id });
}

export async function getGallery() {
  return client.getList<GalleryItem>({ endpoint: "gallery" });
}
