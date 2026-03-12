import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      <h1 className="text-xl font-bold text-gray-800">予約管理</h1>

      <ReservationTable reservations={reservations} />
    </div>
  );
}
