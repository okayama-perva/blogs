"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Menu = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  isActive: boolean;
  sortOrder: number;
};

type FormData = {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  sortOrder: string;
};

const emptyForm: FormData = { name: "", description: "", price: "", duration: "60", category: "", sortOrder: "0" };

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400";

export default function AdminMenuPage() {
  const { status } = useSession();
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  const fetchMenus = useCallback(async () => {
    const res = await fetch("/api/admin/menu");
    if (res.ok) setMenus(await res.json());
  }, []);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      await fetch("/api/admin/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
    } else {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
    fetchMenus();
  };

  const startEdit = (menu: Menu) => {
    setEditingId(menu.id);
    setForm({
      name: menu.name,
      description: menu.description || "",
      price: String(menu.price),
      duration: String(menu.duration),
      category: menu.category || "",
      sortOrder: String(menu.sortOrder),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleActive = async (menu: Menu) => {
    await fetch("/api/admin/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: menu.id, isActive: !menu.isActive }),
    });
    fetchMenus();
  };

  const deleteMenu = async (id: number) => {
    if (!confirm("このメニューを削除しますか？")) return;
    await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
    fetchMenus();
  };

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">メニュー管理</h1>
        <Link
          href="/admin/dashboard"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          予約管理へ戻る
        </Link>
      </div>

      {/* 追加/編集フォーム */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-pink-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-700">
          {editingId ? "メニュー編集" : "新規メニュー追加"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">メニュー名 *</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">カテゴリ</label>
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">料金 (円) *</label>
            <input
              required
              type="number"
              min="0"
              className={inputClass}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">施術時間 (分) *</label>
            <input
              required
              type="number"
              min="1"
              className={inputClass}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">表示順</label>
            <input
              type="number"
              className={inputClass}
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">説明</label>
          <textarea
            rows={2}
            className={inputClass}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {editingId ? "更新" : "追加"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>

      {/* メニュー一覧 */}
      <div className="rounded-xl border border-pink-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pink-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">メニュー名</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">カテゴリ</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">料金</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">時間</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">状態</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="border-t border-pink-50">
                <td className="px-4 py-3 text-gray-800">{menu.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{menu.category || "-"}</td>
                <td className="px-4 py-3 text-right text-gray-800">&yen;{menu.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-500">{menu.duration}分</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(menu)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      menu.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {menu.isActive ? "有効" : "無効"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(menu)}
                      className="text-xs text-pink-500 hover:underline"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => deleteMenu(menu.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  メニューがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
