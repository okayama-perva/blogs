import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 日付範囲で取得
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 401 });

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  const where = from && to
    ? { date: { gte: new Date(from), lte: new Date(to) } }
    : {};

  const slots = await prisma.blockedSlot.findMany({
    where,
    orderBy: [{ date: "asc" }, { startAt: "asc" }],
  });
  return NextResponse.json(slots);
}

// 作成
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, startAt, endAt, reason } = await req.json();
  if (!date || !startAt || !endAt) {
    return NextResponse.json({ error: "date, startAt, endAt required" }, { status: 400 });
  }

  const slot = await prisma.blockedSlot.create({
    data: { date: new Date(date), startAt, endAt, reason: reason || null },
  });
  return NextResponse.json(slot);
}

// 削除
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.blockedSlot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
