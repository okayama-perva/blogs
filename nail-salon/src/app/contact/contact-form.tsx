"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./action";

const inputClass =
  "w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-green-700 font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          お名前 <span className="text-red-400">*</span>
        </label>
        <input id="name" name="name" type="text" required className={inputClass} placeholder="山田 花子" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス <span className="text-red-400">*</span>
        </label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder="example@email.com" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          電話番号
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} placeholder="090-0000-0000" />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          お問い合わせ内容 <span className="text-red-400">*</span>
        </label>
        <textarea id="body" name="body" rows={5} required className={inputClass} placeholder="お気軽にご記入ください" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
      >
        {isPending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
