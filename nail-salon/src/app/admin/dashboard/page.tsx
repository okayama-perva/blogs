import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ReservationTable } from "./reservation-table";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  let reservations: Awaited<ReturnType<typeof prisma.reservation.findMany>> = [];
  try {
    reservations = await prisma.reservation.findMany({
      orderBy: { startAt: "desc" },
    });
  } catch {
    reservations = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">予約管理</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/menu"
            className="rounded-lg border border-pink-200 px-4 py-2 text-sm text-pink-500 hover:bg-pink-50 transition-colors"
          >
            メニュー管理
          </Link>
          <Link
            href="/api/auth/signout"
            className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            ログアウト
          </Link>
        </div>
      </div>

      <ReservationTable reservations={reservations} />
    </div>
  );
}
