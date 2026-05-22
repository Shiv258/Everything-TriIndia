import type { Metadata } from "next";
import Link from "next/link";
import BookingRequestForm from "./BookingRequestForm";

export const metadata: Metadata = {
  title: "Book J Residency | TRIINDIA Hospitality",
  description: "Send a direct booking request for J Residency in Jangpura B, New Delhi.",
};

const roomNameToSlug: Record<string, string> = {
  "Deluxe Room": "deluxe",
  "Studio Room": "studio",
  "Executive Attached Suite Room": "executive-suite",
  "Family Suite Premium Room": "family-suite",
};

function normaliseDate(value: string | undefined) {
  if (!value || value === "Select date") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function normaliseGuests(value: string | undefined) {
  if (!value) return "2";
  const match = value.match(/\d+/);
  return match?.[0] ?? "2";
}

export default async function BookJResidencyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const param = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const room = param("room");

  return (
    <main className="min-h-screen bg-[#090604] px-4 py-8 text-[#fff9ee] sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section className="rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(195,154,87,0.28),transparent_24rem),linear-gradient(160deg,rgba(255,249,238,0.12),rgba(255,249,238,0.04))] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:sticky lg:top-8">
          <Link href="/jresidency" className="text-xs font-black uppercase tracking-[0.24em] text-[#d2ad6d]">Back to J Residency</Link>
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.24em] text-[#d2ad6d]">Direct Booking Desk</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[0.92] text-[#fff9ee] sm:text-6xl">Book J Residency without OTA commission.</h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#ead9bf]">This request goes into the TRIINDIA platform first. Next step will be manager confirmation, Razorpay payment, and WhatsApp confirmation.</p>
          <div className="mt-8 grid gap-3 text-sm text-[#ead9bf]">
            <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Source: Website direct</span>
            <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Offer: RETURN15-ready</span>
            <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Pilot: J Residency, Jangpura B</span>
          </div>
        </section>

        <section>
          <BookingRequestForm
            initial={{
              checkIn: normaliseDate(param("arrival")),
              checkOut: normaliseDate(param("departure")),
              guests: normaliseGuests(param("guests")),
              roomSlug: room ? roomNameToSlug[room] ?? "" : "",
            }}
          />
        </section>
      </div>
    </main>
  );
}
