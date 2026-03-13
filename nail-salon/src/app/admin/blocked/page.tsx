"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type BlockedSlot = {
  id: number;
  date: string;
  startAt: string;
  endAt: string;
  reason: string | null;
};

const TIME_OPTIONS = Array.from({ length: 20 }, (_, i) => {
  const h = Math.floor(i / 2) + 10;
  const m = (i % 2) * 30;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminBlockedPage() {
  const { status } = useSession();
  const router = useRouter();
  const [slots, setSlots] = useState<BlockedSlot[]>([]);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startAt, setStartAt] = useState("10:00");
  const [endAt, setEndAt] = useState("11:00");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  const fetchSlots = useCallback(async () => {
    const from = new Date(calYear, calMonth, 1);
    const to = new Date(calYear, calMonth + 1, 0);
    const res = await fetch(
      `/api/admin/blocked?from=${from.toISOString()}&to=${to.toISOString()}`
    );
    if (res.ok) setSlots(await res.json());
  }, [calYear, calMonth]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const addBlock = async () => {
    if (!selectedDate || startAt >= endAt) return;
    setSaving(true);
    await fetch("/api/admin/blocked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, startAt, endAt, reason }),
    });
    setReason("");
    setSaving(false);
    fetchSlots();
  };

  const removeBlock = async (id: number) => {
    await fetch("/api/admin/blocked", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchSlots();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // カレンダー
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  // 日付ごとのブロック数
  const blockCountByDate: Record<string, number> = {};
  for (const s of slots) {
    const key = s.date.slice(0, 10);
    blockCountByDate[key] = (blockCountByDate[key] ?? 0) + 1;
  }

  // 選択中の日のブロック
  const selectedBlocks = selectedDate
    ? slots.filter((s) => s.date.slice(0, 10) === selectedDate)
    : [];

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">予約ブロック設定</h1>
        <p className="text-xs text-gray-400 mt-1">外部予約や休憩など、予約を受け付けない時間帯を設定します。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* カレンダー */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-sm text-gray-400 hover:text-gray-700 px-2">←</button>
            <span className="text-sm font-medium text-gray-800">{calYear}年{calMonth + 1}月</span>
            <button onClick={nextMonth} className="text-sm text-gray-400 hover:text-gray-700 px-2">→</button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-[10px] text-gray-400 py-1">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />;
              const dateStr = toDateStr(new Date(calYear, calMonth, day));
              const isPast = new Date(calYear, calMonth, day) < today;
              const selected = selectedDate === dateStr;
              const hasBlocks = blockCountByDate[dateStr];
              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                    selected
                      ? "bg-gray-800 text-white"
                      : isPast
                        ? "text-gray-200 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                  {hasBlocks && !selected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右パネル：追加フォーム & 一覧 */}
        <div className="space-y-4">
          {selectedDate ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <p className="text-sm font-medium text-gray-800">
                  {selectedDate.replace(/-/g, "/")} のブロック追加
                </p>
                <div className="flex items-center gap-2">
                  <select
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  >
                    {TIME_OPTIONS.slice(0, -1).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-sm">〜</span>
                  <select
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  >
                    {TIME_OPTIONS.filter((t) => t > startAt).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="理由（任意）例: 外部予約、休憩"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                />
                <button
                  onClick={addBlock}
                  disabled={saving || startAt >= endAt}
                  className="rounded-lg bg-gray-800 px-5 py-2 text-sm text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {saving ? "保存中..." : "ブロック追加"}
                </button>
              </div>

              {/* 既存ブロック一覧 */}
              {selectedBlocks.length > 0 ? (
                <div className="space-y-2">
                  {selectedBlocks.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {b.startAt} 〜 {b.endAt}
                        </p>
                        {b.reason && (
                          <p className="text-xs text-gray-400 mt-0.5">{b.reason}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeBlock(b.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        解除
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">この日のブロックはありません</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-400">カレンダーから日付を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
