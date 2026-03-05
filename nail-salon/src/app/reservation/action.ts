"use server";

import { prisma } from "@/lib/prisma";

export type ReservationState = {
  success: boolean;
  message: string;
} | null;

export async function submitReservation(
  _prev: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  // ハニーポット検証
  const honeypot = formData.get("website") as string;
  if (honeypot) {
    // ボットにはわからないよう成功を偽装
    return { success: true, message: "ご予約を受け付けました。確認メールをお送りいたします。" };
  }

  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const menuName = formData.get("menuName") as string;
  const menuPrice = Number(formData.get("menuPrice"));
  const duration = Number(formData.get("duration"));
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const note = formData.get("note") as string;

  if (!customerName || !customerEmail || !customerPhone || !menuName || !date || !time) {
    return { success: false, message: "必須項目を入力してください。" };
  }

  const startAt = new Date(`${date}T${time}:00`);
  const endAt = new Date(startAt.getTime() + duration * 60 * 1000);

  // 過去の日時チェック
  if (startAt < new Date()) {
    return { success: false, message: "過去の日時は選択できません。" };
  }

  try {
    // レート制限: 同一メールから5分以内の重複予約を拒否
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentReservation = await prisma.reservation.findFirst({
      where: {
        customerEmail,
        createdAt: { gte: fiveMinutesAgo },
      },
    });
    if (recentReservation) {
      return { success: false, message: "短時間での連続予約はできません。5分後にお試しください。" };
    }

    // 空き状況チェック: 同じ時間帯に予約がないか確認
    const overlapping = await prisma.reservation.findFirst({
      where: {
        status: { notIn: ["CANCELLED"] },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });
    if (overlapping) {
      return { success: false, message: "選択された時間帯はすでに予約が入っています。別の時間をお選びください。" };
    }

    await prisma.reservation.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        menuName,
        menuPrice,
        startAt,
        endAt,
        note: note || null,
      },
    });
  } catch {
    return { success: false, message: "予約の登録に失敗しました。しばらくしてからお試しください。" };
  }

  return { success: true, message: "ご予約を受け付けました。確認メールをお送りいたします。" };
}
