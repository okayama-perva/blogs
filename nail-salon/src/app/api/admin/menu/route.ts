import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const err = await requireAuth();
  if (err) return err;

  const menus = await prisma.menu.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(menus);
}

export async function POST(req: NextRequest) {
  const err = await requireAuth();
  if (err) return err;

  const body = await req.json();
  const menu = await prisma.menu.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: Number(body.price),
      duration: Number(body.duration),
      category: body.category || null,
      imageUrl: body.imageUrl || null,
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json(menu, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const err = await requireAuth();
  if (err) return err;

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (data.price !== undefined) data.price = Number(data.price);
  if (data.duration !== undefined) data.duration = Number(data.duration);
  if (data.sortOrder !== undefined) data.sortOrder = Number(data.sortOrder);

  const menu = await prisma.menu.update({ where: { id: Number(id) }, data });
  return NextResponse.json(menu);
}

export async function DELETE(req: NextRequest) {
  const err = await requireAuth();
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.menu.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
