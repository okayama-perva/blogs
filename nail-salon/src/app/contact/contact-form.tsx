"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./action";

const inputClass =
  "w-full border-b border-[var(--accent-light)] bg-transparent px-1 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)]/40 focus:border-[var(--accent)] focus:outline-none transition-colors";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    null
  );

  if (state?.success) {
    return (
      <div className="py-12 text-center">
        <p className="text-[15px] text-[var(--foreground)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {state?.message && (
        <p className="text-xs text-red-500">{state.message}</p>
      )}

      <div>
        <label htmlFor="name" className="block text-xs text-[var(--muted)] mb-1">
          お名前 <span className="text-[var(--accent)]">*</span>
        </label>
        <input id="name" name="name" type="text" required className={inputClass} placeholder="山田 花子" />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs text-[var(--muted)] mb-1">
          メールアドレス <span className="text-[var(--accent)]">*</span>
        </label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder="example@email.com" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs text-[var(--muted)] mb-1">
          電話番号
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} placeholder="090-0000-0000" />
      </div>

      <div>
        <label htmlFor="body" className="block text-xs text-[var(--muted)] mb-1">
          お問い合わせ内容 <span className="text-[var(--accent)]">*</span>
        </label>
        <textarea id="body" name="body" rows={5} required className={inputClass} placeholder="お気軽にご記入ください" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 text-sm tracking-[0.15em] text-white bg-[var(--foreground)] hover:bg-[var(--accent)] transition-colors duration-300 disabled:opacity-40"
      >
        {isPending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
