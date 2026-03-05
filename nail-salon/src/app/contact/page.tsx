import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "お問い合わせ | Nail Salon",
  description: "ネイルサロンへのお問い合わせはこちらから",
};

export default function ContactPage() {
  return (
    <>
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Contact</h1>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mt-4 mb-6" />
        <p className="text-sm text-gray-600">
          ご質問・ご相談はお気軽にお問い合わせください。
        </p>
      </section>

      <div className="max-w-lg mx-auto pb-16">
        <ContactForm />
      </div>
    </>
  );
}
