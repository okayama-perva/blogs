export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Menu } from "@/generated/prisma/client";
import { ReservationForm } from "./reservation-form";

export const metadata: Metadata = {
  title: "ご予約 | Nail Salon",
  description: "ネイルサロンのご予約はこちらから",
};

async function fetchMenus(): Promise<Menu[]> {
  try {
    return await prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function ReservationPage() {
  const menus = await fetchMenus();

  return (
    <>
      <section className="pt-16 pb-12 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--muted)] mb-4">Reservation</p>
        <h1 className="text-2xl sm:text-3xl font-light text-[var(--foreground)]">ご予約</h1>
        <p className="text-sm text-[var(--muted)] mt-4">
          ご希望のメニュー・日時をお選びください。
        </p>
      </section>

      <div className="max-w-2xl mx-auto pb-20">
        <ReservationForm menus={menus} />
      </div>
    </>
  );
}
