"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { getActiveHotels, getUniqueNeighborhoods } from "@/lib/hotels";

const HotelsMap = dynamic(() => import("@/components/map/HotelsMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-3xl bg-neutral-100 text-sm text-neutral-500"
      style={{ height: "560px" }}
    >
      Loading map…
    </div>
  ),
});

export default function DelhiMap() {
  const hotels = getActiveHotels();
  const neighbourhoods = getUniqueNeighborhoods();

  return (
    <section id="map" className="w-full bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 max-w-2xl"
        >
          <span className="mb-5 block text-[11px] uppercase tracking-[0.36em] text-neutral-400">
            Where we are
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-tight text-neutral-950">
            {hotels.length} properties, one Delhi neighbourhood.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-neutral-500">
            All within walking or short-rickshaw distance of Nizamuddin Railway Station — across {neighbourhoods.length} adjacent pockets: {neighbourhoods.join(", ")}.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <HotelsMap hotels={hotels} height="560px" initialZoom={14} />
        </motion.div>
      </div>
    </section>
  );
}
