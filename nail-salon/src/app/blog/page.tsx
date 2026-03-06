import type { Metadata } from "next";
import Link from "next/link";
import { getBlogs, type Blog } from "@/lib/microcms";

export const metadata: Metadata = {
  title: "ブログ | Nail Salon",
  description: "ネイルサロンのブログ記事一覧",
};

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const res = await getBlogs({ limit: 20 });
    return res.contents;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await fetchBlogs();

  return (
    <>
      <section className="pt-16 pb-12 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-4">Journal</p>
        <h1 className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">Blog</h1>
      </section>

      {blogs.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-20">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[var(--gray-light)]">
                {blog.eyecatch ? (
                  <img
                    src={blog.eyecatch.url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : null}
              </div>
              <div className="mt-4">
                {blog.category && (
                  <span className="text-[11px] tracking-[0.1em] text-[var(--accent)]">
                    {blog.category.name}
                  </span>
                )}
                <h2 className="text-[15px] text-[var(--foreground)] mt-1 leading-relaxed group-hover:text-[var(--accent)] transition-colors duration-300">
                  {blog.title}
                </h2>
                <p className="text-[11px] text-[var(--muted)] mt-2">
                  {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--muted)] text-sm py-20">
          記事は準備中です
        </p>
      )}
    </>
  );
}
