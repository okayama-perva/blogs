"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { submitReservation, type ReservationState } from "./action";
import type { Menu } from "@/generated/prisma/browser";

const inputClass =
  "w-full border-b border-[var(--accent-light)] bg-transparent px-1 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)]/40 focus:border-[var(--accent)] focus:outline-none transition-colors";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

type TimeSlot = { time: string; available: boolean };

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function ReservationForm({ menus }: { menus: Menu[] }) {
  const [state, formAction, isPending] = useActionState<ReservationState, FormData>(
    submitReservation,
    null
  );
  const [selectedMenus, setSelectedMenus] = useState<Menu[]>([]);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDuration = selectedMenus.reduce((sum, m) => sum + m.duration, 0);
  const totalPrice = selectedMenus.reduce((sum, m) => sum + m.price, 0);

  const toggleMenu = (menu: Menu) => {
    setSelectedMenus((prev) =>
      prev.some((m) => m.id === menu.id)
        ? prev.filter((m) => m.id !== menu.id)
        : [...prev, menu]
    );
  };

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/reservations/available?date=${date}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setSlots([]);
    }
    setLoadingSlots(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setSelectedTime(null);
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  const getAvailableSlots = useCallback(() => {
    if (selectedMenus.length === 0 || slots.length === 0) return slots;
    const slotsNeeded = Math.ceil(totalDuration / 30);
    return slots.map((slot, i) => {
      if (!slot.available) return slot;
      // 19:00以降は予約不可
      if (slot.time > "19:00") return { ...slot, available: false };
      // 施術終了が20:00を超える場合は不可
      const [h, m] = slot.time.split(":").map(Number);
      const endMinutes = h * 60 + m + totalDuration;
      if (endMinutes > 20 * 60) return { ...slot, available: false };
      // 連続スロットが空いているか
      for (let j = 0; j < slotsNeeded; j++) {
        if (i + j >= slots.length || !slots[i + j].available) {
          return { ...slot, available: false };
        }
      }
      return slot;
    });
  }, [selectedMenus, totalDuration, slots]);

  const displaySlots = getAvailableSlots();

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };

  const calendarDays = getCalendarDays(calYear, calMonth);

  const isPastDate = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isPrevDisabled = calYear === today.getFullYear() && calMonth === today.getMonth();

  useEffect(() => {
    if (state?.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state?.success]);

  if (state?.success) {
    return (
      <div className="py-12 text-center">
        <p className="text-[15px] text-[var(--foreground)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-12">
      {state?.message && (
        <p className="text-xs text-red-500">{state.message}</p>
      )}

      {/* ハニーポット（非表示） */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Step 1: メニュー選択 */}
      <div>
        <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-6">01 — メニューを選択</p>
        {menus.length > 0 ? (
          <div className="divide-y divide-[var(--accent-light)]">
            {menus.map((menu) => {
              const checked = selectedMenus.some((m) => m.id === menu.id);
              return (
                <label
                  key={menu.id}
                  className={`flex items-center justify-between py-5 cursor-pointer transition-colors ${
                    checked ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`inline-block w-4 h-4 rounded border-2 transition-colors ${
                      checked
                        ? "border-[var(--accent)] bg-[var(--accent)]"
                        : "border-[var(--muted)]/30"
                    }`} />
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleMenu(menu)}
                    />
                    <div>
                      <p className="text-[15px]">{menu.name}</p>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">{menu.duration}min</p>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-[var(--accent)]">
                    &yen;{menu.price.toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted)]">メニューを直接入力してください</p>
            <input name="menuName" type="text" required className={inputClass} placeholder="メニュー名" />
            <input name="menuPrice" type="number" required className={inputClass} placeholder="料金" />
            <input name="duration" type="hidden" value="60" />
          </div>
        )}
        {selectedMenus.length > 0 && (
          <>
            <div className="mt-4 p-4 bg-[var(--gray-light)] text-sm text-[var(--foreground)]">
              <p>選択中: {selectedMenus.map((m) => m.name).join(" + ")}</p>
              <p className="mt-1">合計時間: {totalDuration}分 / 合計料金: &yen;{totalPrice.toLocaleString()}</p>
            </div>
            <input type="hidden" name="menuName" value={selectedMenus.map((m) => m.name).join(" + ")} />
            <input type="hidden" name="menuPrice" value={totalPrice} />
            <input type="hidden" name="duration" value={totalDuration} />
          </>
        )}
      </div>

      {/* Step 2: カレンダーで日付選択 */}
      <div>
        <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-6">02 — 日付を選択</p>
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isPrevDisabled}
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            <span className="text-[15px] text-[var(--foreground)]">
              {calYear}年{calMonth + 1}月
            </span>
            <button type="button" onClick={nextMonth} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                className={`text-center text-[11px] py-1 ${
                  i === 0 ? "text-[var(--accent)]" : i === 6 ? "text-[var(--muted)]" : "text-[var(--muted)]"
                }`}
              >
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />;
              const dateStr = formatDate(calYear, calMonth, day);
              const past = isPastDate(day);
              const selected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={past}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square flex items-center justify-center text-[15px] transition-colors ${
                    selected
                      ? "bg-[var(--foreground)] text-white"
                      : past
                        ? "text-[var(--muted)]/20 cursor-not-allowed"
                        : "text-[var(--foreground)] hover:bg-[var(--gray-light)]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        {selectedDate && <input type="hidden" name="date" value={selectedDate} />}
      </div>

      {/* Step 3: 時間枠選択 */}
      {selectedDate && (
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2">
            03 — 時間を選択
          </p>
          <p className="text-sm text-[var(--muted)] mb-6">
            {selectedDate.replace(/-/g, "/")}
          </p>
          {loadingSlots ? (
            <p className="text-sm text-[var(--muted)] text-center py-8">読み込み中...</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {displaySlots.map((slot) => {
                const selected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2.5 text-[15px] transition-colors ${
                      selected
                        ? "bg-[var(--foreground)] text-white"
                        : slot.available
                          ? "bg-[var(--gray-light)] text-[var(--foreground)] hover:bg-[var(--accent-light)]"
                          : "text-[var(--muted)]/20 cursor-not-allowed line-through"
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
          {selectedTime && <input type="hidden" name="time" value={selectedTime} />}
        </div>
      )}

      {/* Step 4: 顧客情報 */}
      {selectedTime && (
        <div className="space-y-6">
          <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2">04 — お客様情報</p>
          <div>
            <label htmlFor="customerName" className="block text-xs text-[var(--muted)] mb-1">
              お名前 <span className="text-[var(--accent)]">*</span>
            </label>
            <input id="customerName" name="customerName" type="text" required className={inputClass} placeholder="山田 花子" />
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-xs text-[var(--muted)] mb-1">
              メールアドレス <span className="text-[var(--accent)]">*</span>
            </label>
            <input id="customerEmail" name="customerEmail" type="email" required className={inputClass} placeholder="example@email.com" />
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-xs text-[var(--muted)] mb-1">
              電話番号 <span className="text-[var(--accent)]">*</span>
            </label>
            <input id="customerPhone" name="customerPhone" type="tel" required className={inputClass} placeholder="090-0000-0000" />
          </div>

          <div>
            <label htmlFor="note" className="block text-xs text-[var(--muted)] mb-1">
              備考
            </label>
            <textarea id="note" name="note" rows={3} className={inputClass} placeholder="ご要望があればご記入ください" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 text-sm tracking-[0.15em] text-white bg-[var(--foreground)] hover:bg-[var(--accent)] transition-colors duration-300 disabled:opacity-40"
          >
            {isPending ? "送信中..." : "予約する"}
          </button>
        </div>
      )}
    </form>
  );
}
