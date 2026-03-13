"use client";

import { useState, useEffect, useCallback } from "react";

type Reservation = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  menuName: string;
  menuPrice: number;
  startAt: string;
  endAt: string;
  status: string;
  note: string | null;
};

type ViewMode = "day" | "week" | "month";

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "仮予約", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "確定", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "キャンセル", color: "bg-red-100 text-red-700" },
  DONE: { label: "完了", color: "bg-gray-100 text-gray-600" },
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfWeek(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜始まり
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function getRange(date: Date, mode: ViewMode): [Date, Date] {
  if (mode === "day") {
    const s = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const e = new Date(s);
    e.setDate(e.getDate() + 1);
    return [s, e];
  }
  if (mode === "week") {
    const s = startOfWeek(date);
    const e = new Date(s);
    e.setDate(e.getDate() + 7);
    return [s, e];
  }
  // month
  const s = new Date(date.getFullYear(), date.getMonth(), 1);
  const e = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return [s, e];
}

function navigate(date: Date, mode: ViewMode, dir: -1 | 1): Date {
  const d = new Date(date);
  if (mode === "day") d.setDate(d.getDate() + dir);
  else if (mode === "week") d.setDate(d.getDate() + dir * 7);
  else d.setMonth(d.getMonth() + dir);
  return d;
}

function formatTitle(date: Date, mode: ViewMode): string {
  if (mode === "day") {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}（${WEEKDAYS[date.getDay()]}）`;
  }
  if (mode === "week") {
    const s = startOfWeek(date);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    return `${s.getMonth() + 1}/${s.getDate()} 〜 ${e.getMonth() + 1}/${e.getDate()}`;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function timeStr(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function dateLabel(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）`;
}

export function ReservationDashboard() {
  const [mode, setMode] = useState<ViewMode>("day");
  const [current, setCurrent] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [from, to] = getRange(current, mode);
    const res = await fetch(
      `/api/admin/reservations?from=${from.toISOString()}&to=${to.toISOString()}`
    );
    if (res.ok) setReservations(await res.json());
    setLoading(false);
  }, [current, mode]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const today = new Date();
  const isToday = toDateStr(current) === toDateStr(today);

  // 日ごとにグルーピング（週・月ビュー用）
  const grouped = reservations.reduce<Record<string, Reservation[]>>((acc, r) => {
    const key = toDateStr(new Date(r.startAt));
    (acc[key] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">予約管理</h1>
        <div className="flex items-center gap-2">
          {/* ビュー切替 */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
            {(["day", "week", "month"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 transition-colors ${
                  mode === m ? "bg-gray-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {{ day: "日", week: "週", month: "月" }[m]}
              </button>
            ))}
          </div>
          {!isToday && (
            <button
              onClick={() => setCurrent(new Date())}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
            >
              今日
            </button>
          )}
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
        <button
          onClick={() => setCurrent(navigate(current, mode, -1))}
          className="text-sm text-gray-400 hover:text-gray-700 px-2"
        >
          ←
        </button>
        <span className="text-sm font-medium text-gray-800">{formatTitle(current, mode)}</span>
        <button
          onClick={() => setCurrent(navigate(current, mode, 1))}
          className="text-sm text-gray-400 hover:text-gray-700 px-2"
        >
          →
        </button>
      </div>

      {/* コンテンツ */}
      {loading ? (
        <p className="text-center text-sm text-gray-400 py-12">読み込み中...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">予約はありません</p>
      ) : mode === "day" ? (
        <DayView reservations={reservations} onStatusChange={updateStatus} />
      ) : (
        <GroupedView grouped={grouped} onStatusChange={updateStatus} />
      )}
    </div>
  );
}

// ======= 日表示 =======
function DayView({
  reservations,
  onStatusChange,
}: {
  reservations: Reservation[];
  onStatusChange: (id: number, status: string) => void;
}) {
  return (
    <div className="space-y-2">
      {reservations.map((r) => (
        <ReservationCard key={r.id} r={r} onStatusChange={onStatusChange} showDate={false} />
      ))}
    </div>
  );
}

// ======= 週・月表示（日ごとグループ） =======
function GroupedView({
  grouped,
  onStatusChange,
}: {
  grouped: Record<string, Reservation[]>;
  onStatusChange: (id: number, status: string) => void;
}) {
  const sortedDates = Object.keys(grouped).sort();
  return (
    <div className="space-y-4">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">
              {dateLabel(dateKey + "T00:00:00")}
            </span>
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              {grouped[dateKey].length}件
            </span>
          </div>
          <div className="space-y-2">
            {grouped[dateKey].map((r) => (
              <ReservationCard key={r.id} r={r} onStatusChange={onStatusChange} showDate={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ======= 予約カード =======
function ReservationCard({
  r,
  onStatusChange,
  showDate,
}: {
  r: Reservation;
  onStatusChange: (id: number, status: string) => void;
  showDate: boolean;
}) {
  const s = statusLabels[r.status] || statusLabels.PENDING;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      {/* 時間 */}
      <div className="sm:w-28 shrink-0">
        {showDate && (
          <p className="text-[11px] text-gray-400">{dateLabel(r.startAt)}</p>
        )}
        <p className="text-sm font-medium text-gray-800">
          {timeStr(r.startAt)} 〜 {timeStr(r.endAt)}
        </p>
      </div>

      {/* 情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">{r.customerName}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.color}`}>
            {s.label}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {r.menuName} / &yen;{r.menuPrice.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">{r.customerPhone}</p>
        {r.note && <p className="text-xs text-gray-400 mt-1">📝 {r.note}</p>}
      </div>

      {/* ステータス変更 */}
      <select
        className="sm:w-24 shrink-0 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:border-gray-400 focus:outline-none"
        value={r.status}
        onChange={(e) => onStatusChange(r.id, e.target.value)}
      >
        <option value="PENDING">仮予約</option>
        <option value="CONFIRMED">確定</option>
        <option value="CANCELLED">キャンセル</option>
        <option value="DONE">完了</option>
      </select>
    </div>
  );
}
