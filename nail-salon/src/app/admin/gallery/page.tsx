"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type GalleryImage = {
  id: number;
  fileName: string;
  caption: string | null;
  width: number;
  height: number;
  createdAt: string;
};

export default function AdminGalleryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  const fetchImages = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setImages(await res.json());
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }
    await fetch("/api/admin/gallery", { method: "POST", body: formData });
    setUploading(false);
    fetchImages();
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteImage = async (id: number) => {
    if (!confirm("この画像を削除しますか？")) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchImages();
  };

  const updateCaption = async (id: number, caption: string) => {
    await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, caption }),
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">ギャラリー管理</h1>

      {/* アップロードエリア */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-gray-400 bg-gray-100" : "border-gray-200 bg-white"
        }`}
      >
        <p className="text-sm text-gray-500 mb-3">
          ドラッグ&ドロップ または ファイルを選択
        </p>
        <p className="text-xs text-gray-400 mb-4">
          JPG / PNG / WebP / HEIC 対応（複数選択可）
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-gray-800 px-6 py-2 text-sm text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {uploading ? "アップロード中..." : "ファイルを選択"}
        </button>
      </div>

      {/* 画像一覧 */}
      {images.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">画像はまだありません</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={`/uploads/gallery/${img.fileName}`}
                alt={img.caption || ""}
                className="w-full aspect-square object-cover"
              />
              {/* オーバーレイ */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="text"
                    placeholder="キャプション"
                    defaultValue={img.caption || ""}
                    onBlur={(e) => updateCaption(img.id, e.target.value)}
                    className="w-full rounded bg-white/90 px-2 py-1 text-xs text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                &times;
              </button>
              <span className="absolute top-1.5 left-1.5 text-[10px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(img.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
