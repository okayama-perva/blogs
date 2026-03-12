import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/slider");
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

async function ensureDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

// 一覧取得
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 401 });

  const images = await prisma.sliderImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(images);
}

// アップロード
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string) || "";

  if (!file) {
    return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
    return NextResponse.json({ error: "対応していない形式です" }, { status: 400 });
  }

  await ensureDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomBytes(8).toString("hex");
  const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic");

  let processed: sharp.Sharp;
  let ext: string;

  if (isHeic) {
    processed = sharp(buffer).webp({ quality: 85 });
    ext = "webp";
  } else if (file.type === "image/png") {
    processed = sharp(buffer).png({ quality: 85, compressionLevel: 8 });
    ext = "png";
  } else if (file.type === "image/webp") {
    processed = sharp(buffer).webp({ quality: 85 });
    ext = "webp";
  } else {
    processed = sharp(buffer).jpeg({ quality: 85, mozjpeg: true });
    ext = "jpg";
  }

  const outputBuffer = await processed.toBuffer();
  const fileName = `${id}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, fileName), outputBuffer);

  // 末尾に追加
  const maxOrder = await prisma.sliderImage.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const image = await prisma.sliderImage.create({
    data: { fileName, alt, sortOrder: nextOrder },
  });

  return NextResponse.json(image);
}

// 削除
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const image = await prisma.sliderImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await unlink(path.join(UPLOAD_DIR, image.fileName));
  } catch {}

  await prisma.sliderImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

// 並び順・alt更新
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // 並び順一括更新
  if (Array.isArray(body)) {
    for (const { id, sortOrder } of body) {
      await prisma.sliderImage.update({ where: { id }, data: { sortOrder } });
    }
    return NextResponse.json({ ok: true });
  }

  // 単体更新
  const { id, alt } = body;
  const image = await prisma.sliderImage.update({
    where: { id },
    data: { alt },
  });
  return NextResponse.json(image);
}
