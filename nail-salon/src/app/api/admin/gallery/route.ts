import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/gallery");
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

  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(images);
}

// アップロード
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const caption = (formData.get("caption") as string) || null;

  if (files.length === 0) {
    return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
  }

  await ensureDir();
  const results = [];

  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = crypto.randomBytes(8).toString("hex");
    const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic");

    let processed: sharp.Sharp;
    let ext: string;

    if (isHeic) {
      // HEIC → webp
      processed = sharp(buffer).webp({ quality: 85 });
      ext = "webp";
    } else if (file.type === "image/png") {
      processed = sharp(buffer).png({ quality: 85, compressionLevel: 8 });
      ext = "png";
    } else if (file.type === "image/webp") {
      processed = sharp(buffer).webp({ quality: 85 });
      ext = "webp";
    } else {
      // jpeg
      processed = sharp(buffer).jpeg({ quality: 85, mozjpeg: true });
      ext = "jpg";
    }

    const outputBuffer = await processed.toBuffer();
    const metadata = await sharp(outputBuffer).metadata();
    const fileName = `${id}.${ext}`;

    await writeFile(path.join(UPLOAD_DIR, fileName), outputBuffer);

    const image = await prisma.galleryImage.create({
      data: {
        fileName,
        caption,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
      },
    });

    results.push(image);
  }

  return NextResponse.json(results);
}

// 削除
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ファイル削除
  try {
    await unlink(path.join(UPLOAD_DIR, image.fileName));
  } catch {
    // ファイルが既になくてもDB削除は続行
  }

  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

// キャプション更新
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, caption } = await req.json();
  const image = await prisma.galleryImage.update({
    where: { id },
    data: { caption },
  });
  return NextResponse.json(image);
}
