import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: { guest: true, property: true, room: true },
  });

  return (
    <main className="min-h-screen bg-[#f6efe3] px-4 py-8 text-[#15100b] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ad7b33]">TRIINDIA Platform</p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Booking command room</h1>
          </div>
          <Link href="/book/j-residency" className="rounded-full bg-[#15100b] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#fff9ee]">New Booking</Link>
        </div>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#dfc9aa] bg-[#fff9ee] shadow-xl shadow-[#2a1b12]/10">
          <div className="grid grid-cols-5 gap-4 border-b border-[#dfc9aa] bg-[#efe0c8] px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#6f5944]">
            <span>Reference</span>
            <span>Guest</span>
            <span>Stay</span>
            <span>Room</span>
            <span>Status</span>
          </div>
          {bookings.length === 0 ? (
            <p className="px-5 py-8 text-[#6f5944]">No booking requests yet. Submit one from the J Residency booking page.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="grid grid-cols-1 gap-2 border-b border-[#eadcc5] px-5 py-4 text-sm last:border-b-0 sm:grid-cols-5 sm:gap-4">
                <strong>{booking.reference}</strong>
                <span>{booking.guest.fullName}<br /><small className="text-[#6f5944]">{booking.guest.phone}</small></span>
                <span>{booking.checkIn.toLocaleDateString("en-IN")} - {booking.checkOut.toLocaleDateString("en-IN")}</span>
                <span>{booking.room?.name ?? "Recommend"}</span>
                <span className="font-bold text-[#ad7b33]">{booking.status}</span>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
