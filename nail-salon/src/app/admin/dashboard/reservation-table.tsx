"use client";

import { useRouter } from "next/navigation";

type Reservation = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  menuName: string;
  menuPrice: number;
  startAt: Date;
  endAt: Date;
  status: string;
  note: string | null;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "仮予約", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "確定", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "キャンセル", color: "bg-red-100 text-red-700" },
  DONE: { label: "完了", color: "bg-gray-100 text-gray-600" },
};

export function ReservationTable({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  if (reservations.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-16">予約はまだありません</p>;
  }

  return (
    <>
      {/* PC表示: テーブル */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 font-medium">日時</th>
              <th className="pb-3 font-medium">お客様</th>
              <th className="pb-3 font-medium">メニュー</th>
              <th className="pb-3 font-medium">料金</th>
              <th className="pb-3 font-medium">ステータス</th>
              <th className="pb-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => {
              const s = statusLabels[r.status] || statusLabels.PENDING;
              return (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="py-3">
                    {new Date(r.startAt).toLocaleDateString("ja-JP")}<br />
                    <span className="text-xs text-gray-400">
                      {new Date(r.startAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                      〜{new Date(r.endAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="py-3">
                    {r.customerName}<br />
                    <span className="text-xs text-gray-400">{r.customerPhone}</span>
                  </td>
                  <td className="py-3">{r.menuName}</td>
                  <td className="py-3">&yen;{r.menuPrice.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <select
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                    >
                      <option value="PENDING">仮予約</option>
                      <option value="CONFIRMED">確定</option>
                      <option value="CANCELLED">キャンセル</option>
                      <option value="DONE">完了</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* スマホ表示: カード */}
      <div className="md:hidden space-y-4">
        {reservations.map((r) => {
          const s = statusLabels[r.status] || statusLabels.PENDING;
          return (
            <div key={r.id} className="rounded-xl border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>
                  {s.label}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(r.startAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
              <p className="font-semibold text-gray-800">{r.customerName}</p>
              <p className="text-xs text-gray-500">{r.menuName} / &yen;{r.menuPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400">
                {new Date(r.startAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                〜{new Date(r.endAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <select
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={r.status}
                onChange={(e) => updateStatus(r.id, e.target.value)}
              >
                <option value="PENDING">仮予約</option>
                <option value="CONFIRMED">確定</option>
                <option value="CANCELLED">キャンセル</option>
                <option value="DONE">完了</option>
              </select>
            </div>
          );
        })}
      </div>
    </>
  );
}
