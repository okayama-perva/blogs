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
    <article className="max-w-2xl mx-auto pt-8 pb-20">
      <Link
        href="/blog"
        className="text-sm tracking-[0.1em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300"
      >
        ← Back
      </Link>

      <div className="mt-10">
        {blog.category && (
          <span className="text-[11px] tracking-[0.1em] text-[var(--accent)]">
            {blog.category.name}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-light text-[var(--foreground)] mt-2 leading-relaxed">
          {blog.title}
        </h1>
        <p className="text-[11px] text-[var(--muted)] mt-3">
          {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
        </p>
      </div>

      {blog.eyecatch && (
        <img
          src={blog.eyecatch.url}
          alt={blog.title}
          className="w-full mt-10"
        />
      )}

      <div
        className="prose prose-sm sm:prose max-w-none mt-12
          prose-headings:font-light prose-headings:text-[var(--foreground)]
          prose-p:text-[var(--muted)] prose-p:leading-loose prose-p:text-[15px]
          prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}
