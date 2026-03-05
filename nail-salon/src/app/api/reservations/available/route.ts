import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 30分刻み 10:00〜19:00
const ALL_SLOTS = Array.from({ length: 19 }, (_, i) => {
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

  const reservations = await prisma.reservation.findMany({
    where: {
      startAt: { gte: dayStart, lte: dayEnd },
      status: { notIn: ["CANCELLED"] },
    },
    select: { startAt: true, endAt: true },
  });

  // 予約済みの時間帯を計算
  const bookedSlots = new Set<string>();
  for (const r of reservations) {
    const start = new Date(r.startAt);
    const end = new Date(r.endAt);
    // この予約がカバーする30分枠をすべてマーク
    for (const slot of ALL_SLOTS) {
      const [h, m] = slot.split(":").map(Number);
      const slotStart = new Date(`${date}T${slot}:00`);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
      if (slotStart < end && slotEnd > start) {
        bookedSlots.add(slot);
      }
    }
  }

  const slots = ALL_SLOTS.map((time) => ({
    time,
    available: !bookedSlots.has(time),
  }));

  return NextResponse.json({ date, slots });
}
