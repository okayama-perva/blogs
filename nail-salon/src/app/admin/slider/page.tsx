"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type SliderImage = {
  id: number;
  fileName: string;
  alt: string;
  sortOrder: number;
};

export default function AdminSliderPage() {
  const { status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<SliderImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  const fetchImages = useCallback(async () => {
    const res = await fetch("/api/admin/slider");
    if (res.ok) setImages(await res.json());
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/slider", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setUploadError(data.error || `アップロード失敗 (${res.status})`);
      } else {
        fetchImages();
      }
    } catch (e) {
      setUploadError(`ネットワークエラー: ${e instanceof Error ? e.message : String(e)}`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteImage = async (id: number) => {
    if (!confirm("このスライダー画像を削除しますか？")) return;
    await fetch("/api/admin/slider", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchImages();
  };

  const updateAlt = async (id: number, alt: string) => {
    await fetch("/api/admin/slider", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, alt }),
    });
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const updated = [...images];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    const payload = updated.map((img, i) => ({ id: img.id, sortOrder: i }));
    setImages(updated);
    await fetch("/api/admin/slider", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">スライダー管理</h1>
      <p className="text-xs text-gray-400">トップページのコンセプトセクションに表示されるスライド画像を管理します。</p>

      {/* アップロード */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 flex items-center gap-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-gray-800 px-5 py-2 text-sm text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {uploading ? "アップロード中..." : "画像を追加"}
        </button>
        <span className="text-xs text-gray-400">JPG / PNG / WebP / HEIC</span>
      </div>

      {/* 一覧 */}
      {images.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">スライダー画像はまだありません</p>
      ) : (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3">
              {/* 並び順ボタン */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-20 px-1"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-20 px-1"
                >
                  ▼
                </button>
              </div>
              {/* サムネイル */}
              <img
                src={`/uploads/slider/${img.fileName}`}
                alt={img.alt}
                className="w-24 h-16 object-cover rounded"
              />
              {/* alt入力 */}
              <input
                type="text"
                placeholder="代替テキスト"
                defaultValue={img.alt}
                onBlur={(e) => updateAlt(img.id, e.target.value)}
                className="flex-1 rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
              {/* 削除 */}
              <button
                onClick={() => deleteImage(img.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
