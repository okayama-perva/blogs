import type { Metadata } from "next";
import Link from "next/link";
import { getBlog } from "@/lib/microcms";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const blog = await getBlog(id);
    return { title: `${blog.title} | Nail Salon` };
  } catch {
    return { title: "記事が見つかりません | Nail Salon" };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  let blog;
  try {
    const { id } = await params;
    blog = await getBlog(id);
  } catch {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto pb-16">
      <Link href="/blog" className="text-sm text-pink-500 hover:underline">
        ← ブログ一覧に戻る
      </Link>

      <div className="mt-6">
        {blog.category && (
          <span className="text-xs text-pink-500 font-medium">
            {blog.category.name}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
          {blog.title}
        </h1>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
        </p>
      </div>

      {blog.eyecatch && (
        <img
          src={blog.eyecatch.url}
          alt={blog.title}
          className="w-full rounded-xl mt-6"
        />
      )}

      <div
        className="prose prose-sm sm:prose max-w-none mt-8
          prose-headings:text-gray-800 prose-a:text-pink-500
          prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}
