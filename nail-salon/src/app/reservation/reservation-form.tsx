"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { submitReservation, type ReservationState } from "./action";
import type { Menu } from "@/generated/prisma/browser";

const inputClass =
  "w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400";

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
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // メニュー選択時に施術時間分の枠を考慮して利用可能判定を更新
  const getAvailableSlots = useCallback(() => {
    if (!selectedMenu || slots.length === 0) return slots;
    const slotsNeeded = Math.ceil(selectedMenu.duration / 30);
    return slots.map((slot, i) => {
      if (!slot.available) return slot;
      // 施術に必要な連続枠がすべて空いているか
      for (let j = 0; j < slotsNeeded; j++) {
        if (i + j >= slots.length || !slots[i + j].available) {
          return { ...slot, available: false };
        }
      }
      return slot;
    });
  }, [selectedMenu, slots]);

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

  if (state?.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-green-700 font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      {/* ハニーポット（非表示） */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Step 1: メニュー選択 */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">1. メニューを選択</h2>
        {menus.length > 0 ? (
          <div className="space-y-2">
            {menus.map((menu) => (
              <label
                key={menu.id}
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${
                  selectedMenu?.id === menu.id
                    ? "border-pink-400 bg-pink-50"
                    : "border-pink-100 hover:border-pink-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="menuSelect"
                    value={menu.id}
                    className="accent-pink-500"
                    onChange={() => setSelectedMenu(menu)}
                    required
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{menu.name}</p>
                    <p className="text-xs text-gray-500">{menu.duration}分</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-pink-500">
                  &yen;{menu.price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 mb-2">メニューを直接入力してください</p>
            <input name="menuName" type="text" required className={inputClass} placeholder="メニュー名" />
            <input name="menuPrice" type="number" required className={`${inputClass} mt-2`} placeholder="料金" />
            <input name="duration" type="hidden" value="60" />
          </div>
        )}
        {selectedMenu && (
          <>
            <input type="hidden" name="menuName" value={selectedMenu.name} />
            <input type="hidden" name="menuPrice" value={selectedMenu.price} />
            <input type="hidden" name="duration" value={selectedMenu.duration} />
          </>
        )}
      </div>

      {/* Step 2: カレンダーで日付選択 */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">2. 日付を選択</h2>
        <div className="rounded-xl border border-pink-100 p-4">
          {/* カレンダーヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isPrevDisabled}
              className="p-1 text-gray-400 hover:text-pink-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &larr;
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {calYear}年{calMonth + 1}月
            </span>
            <button type="button" onClick={nextMonth} className="p-1 text-gray-400 hover:text-pink-500">
              &rarr;
            </button>
          </div>

          {/* 曜日 */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                className={`text-center text-xs font-medium py-1 ${
                  i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
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
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                    selected
                      ? "bg-pink-500 text-white font-bold"
                      : past
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-pink-50"
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
          <h2 className="text-sm font-bold text-gray-700 mb-3">
            3. 時間を選択
            <span className="text-xs font-normal text-gray-400 ml-2">
              {selectedDate.replace(/-/g, "/")}
            </span>
          </h2>
          {loadingSlots ? (
            <p className="text-sm text-gray-400 text-center py-8">読み込み中...</p>
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
                    className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                      selected
                        ? "bg-pink-500 text-white"
                        : slot.available
                          ? "bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
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
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-700 mb-1">4. お客様情報</h2>
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              お名前 <span className="text-red-400">*</span>
            </label>
            <input id="customerName" name="customerName" type="text" required className={inputClass} placeholder="山田 花子" />
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-400">*</span>
            </label>
            <input id="customerEmail" name="customerEmail" type="email" required className={inputClass} placeholder="example@email.com" />
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号 <span className="text-red-400">*</span>
            </label>
            <input id="customerPhone" name="customerPhone" type="tel" required className={inputClass} placeholder="090-0000-0000" />
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <textarea id="note" name="note" rows={3} className={inputClass} placeholder="ご要望があればご記入ください" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isPending ? "送信中..." : "予約する"}
          </button>
        </div>
      )}
    </form>
  );
}
