"use server";

export type ContactState = {
  success: boolean;
  message: string;
} | null;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const body = formData.get("body") as string;

  if (!name || !email || !body) {
    return { success: false, message: "必須項目を入力してください。" };
  }

  // TODO: メール送信処理（nodemailer等）を実装
  console.log("お問い合わせ受信:", { name, email, phone, body });

  return { success: true, message: "お問い合わせを受け付けました。ありがとうございます。" };
}
