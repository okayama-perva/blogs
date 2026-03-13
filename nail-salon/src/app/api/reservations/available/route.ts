import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 30分刻み 10:00〜19:30（19:30は連続スロットチェック用）
const ALL_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 10;
  const min = (i % 2) * 30;
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date parameter required (YYYY-MM-DD)" }, { status: 400 });
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  // 予約とブロック枠を並行取得
  const [reservations, blockedSlots] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        startAt: { gte: dayStart, lte: dayEnd },
        status: { notIn: ["CANCELLED"] },
      },
      select: { startAt: true, endAt: true },
    }),
    prisma.blockedSlot.findMany({
      where: { date: new Date(date) },
      select: { startAt: true, endAt: true },
    }),
  ]);

  const unavailable = new Set<string>();

  // 予約済み枠
  for (const r of reservations) {
    const start = new Date(r.startAt);
    const end = new Date(r.endAt);
    for (const slot of ALL_SLOTS) {
      const slotStart = new Date(`${date}T${slot}:00`);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
      if (slotStart < end && slotEnd > start) {
        unavailable.add(slot);
      }
    }
  }

  // ブロック枠
  for (const b of blockedSlots) {
    for (const slot of ALL_SLOTS) {
      if (slot >= b.startAt && slot < b.endAt) {
        unavailable.add(slot);
      }
    }
  }

  const slots = ALL_SLOTS.map((time) => ({
    time,
    available: !unavailable.has(time),
  }));

  return NextResponse.json({ date, slots });
}
