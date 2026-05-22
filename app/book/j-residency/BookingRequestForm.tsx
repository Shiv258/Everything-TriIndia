"use client";

import { useState } from "react";

const roomOptions = [
  { value: "deluxe", label: "Deluxe Room" },
  { value: "studio", label: "Studio Room" },
  { value: "executive-suite", label: "Executive Attached Suite Room" },
  { value: "family-suite", label: "Family Suite Premium Room" },
];

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomSlug: string;
  specialRequests: string;
};

export default function BookingRequestForm({ initial }: { initial: Partial<FormState> }) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    checkIn: initial.checkIn ?? "",
    checkOut: initial.checkOut ?? "",
    guests: initial.guests ?? "2",
    roomSlug: initial.roomSlug ?? "",
    specialRequests: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, propertySlug: "j-residency" }),
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      setState("error");
      setMessage(result.error ?? "Please check the form and try again.");
      return;
    }

    setState("success");
    setMessage(`Request saved. Booking reference: ${result.booking.reference}`);
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-[#dfc9aa] bg-[#fff9ee]/95 p-5 shadow-2xl shadow-black/10 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944]">
          Guest Name
          <input className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944]">
          Phone
          <input className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944]">
          Email Optional
          <input type="email" className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.email} onChange={(event) => update("email", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944]">
          Guests
          <select className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.guests} onChange={(event) => update("guests", event.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((guestCount) => <option key={guestCount} value={guestCount}>{guestCount} guest{guestCount > 1 ? "s" : ""}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944]">
          Check-In
          <input type="date" className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.checkIn} onChange={(event) => update("checkIn", event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944]">
          Check-Out
          <input type="date" className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.checkOut} onChange={(event) => update("checkOut", event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944] sm:col-span-2">
          Room Preference
          <select className="rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.roomSlug} onChange={(event) => update("roomSlug", event.target.value)}>
            <option value="">Manager can recommend</option>
            {roomOptions.map((room) => <option key={room.value} value={room.value}>{room.label}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6f5944] sm:col-span-2">
          Special Requests
          <textarea className="min-h-28 rounded-2xl border border-[#dfc9aa] bg-white px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#23160e] outline-none focus:border-[#ad7b33]" value={form.specialRequests} onChange={(event) => update("specialRequests", event.target.value)} placeholder="Late arrival, extra bed, airport guidance, food preference..." />
        </label>
      </div>

      <button disabled={state === "submitting"} className="mt-6 w-full rounded-full bg-[#15100b] px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#fff9ee] transition hover:bg-[#ad7b33] disabled:cursor-wait disabled:opacity-60">
        {state === "submitting" ? "Saving Request..." : "Send Booking Request"}
      </button>

      {message && <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${state === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{message}</p>}
    </form>
  );
}
