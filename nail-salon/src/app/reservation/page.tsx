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
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Reservation</h1>
        <div className="w-12 h-0.5 bg-pink-400 mx-auto mt-4 mb-6" />
        <p className="text-sm text-gray-600">
          ご希望のメニュー・日時をお選びください。
        </p>
      </section>

      <div className="max-w-2xl mx-auto pb-16">
        <ReservationForm menus={menus} />
      </div>
    </>
  );
}
