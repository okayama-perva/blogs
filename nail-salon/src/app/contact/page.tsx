import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "お問い合わせ | Nail Salon",
  description: "ネイルサロンへのお問い合わせはこちらから",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-16 pb-12 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-4">Contact</p>
        <h1 className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">お問い合わせ</h1>
        <p className="text-sm text-[var(--muted)] mt-4">
          ご質問・ご相談はお気軽にお問い合わせください。
        </p>
      </section>

      <div className="max-w-lg mx-auto pb-20">
        <ContactForm />
      </div>
    </>
  );
}
