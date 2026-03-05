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
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Blog</h1>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mt-4" />
      </section>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block rounded-xl border border-pink-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {blog.eyecatch ? (
                <img
                  src={blog.eyecatch.url}
                  alt={blog.title}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-pink-50 flex items-center justify-center text-pink-300 text-sm">
                  No Image
                </div>
              )}
              <div className="p-4">
                {blog.category && (
                  <span className="text-xs text-pink-500 font-medium">
                    {blog.category.name}
                  </span>
                )}
                <h2 className="font-semibold text-gray-800 mt-1 group-hover:text-pink-500 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-16">
          記事は準備中です
        </p>
      )}
    </>
  );
}
