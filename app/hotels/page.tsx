import type { Metadata } from "next";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import HotelCard from "@/components/hotels/HotelCard";
import { getActiveHotels } from "@/lib/hotels";
import { TRIINDIA_HOTELS_TOTAL } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Hotels | TriIndia Hospitality",
  description:
    "The TriIndia portfolio — 15+ hotels operated across central Delhi. Browse properties, see neighbourhoods, book direct.",
  openGraph: {
    title: "Hotels — TriIndia Hospitality",
    description: "Browse our properties across central Delhi.",
    images: ["/triindia-logo.jpeg"],
  },
};

export default function HotelsListPage() {
  const hotels = getActiveHotels();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main>
        <section className="pb-16 pt-36 md:pb-20 md:pt-44">
          <div className="mx-auto max-w-7xl px-6">
            <span className="mb-5 block text-[11px] uppercase tracking-[0.36em] text-neutral-400">
              Portfolio
            </span>
            <h1 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-tight text-neutral-950">
              {TRIINDIA_HOTELS_TOTAL} hotels. One organisation.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-500">
              We run {hotels.length} of them on this website today — the rest are coming online in phases. All operated directly by TriIndia. All clustered in central Delhi, around Nizamuddin Railway Station and Ashram Metro.
            </p>
          </div>
        </section>

        <section className="bg-white pb-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel, index) => (
                <HotelCard key={hotel.slug} hotel={hotel} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
