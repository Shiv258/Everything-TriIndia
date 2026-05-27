/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getAllGalleryImages } from "@/lib/hotels";

const tiles = (() => {
  const entries = getAllGalleryImages();
  if (entries.length === 0) return [];
  const interleaved: typeof entries = [];
  const maxLen = Math.max(...entries.map(() => 1));
  for (let i = 0; i < entries.length; i += maxLen) {
    interleaved.push(entries[i]);
  }
  return entries;
})();

export default function PortfolioMarquee() {
  if (tiles.length === 0) return null;
  const duplicated = [...tiles, ...tiles];

  return (
    <section
      id="portfolio"
      className="w-full overflow-hidden bg-neutral-950 py-20 md:py-28"
    >
      <style>{`
        @keyframes triindia-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .triindia-marquee { animation: triindia-marquee 36s linear infinite; }
        .triindia-marquee-mask {
          mask: linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%);
        }
        @media (max-width: 640px) {
          .triindia-marquee { animation-duration: 22s; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto mb-14 max-w-7xl px-6"
      >
        <span className="mb-4 block text-[11px] uppercase tracking-[0.36em] text-white/45">
          Portfolio
        </span>
        <h2 className="max-w-2xl font-display text-[clamp(1.85rem,3.6vw,3rem)] leading-[1.08] tracking-tight text-white">
          A closer look at the properties.
        </h2>
      </motion.div>

      <div className="triindia-marquee-mask w-full">
        <div className="triindia-marquee flex w-max gap-5 md:gap-6">
          {duplicated.map((entry, index) => (
            <Link
              key={`${entry.hotel.slug}-${index}`}
              href={`/hotels/${entry.hotel.slug}`}
              className="group relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl md:h-72 md:w-72 lg:h-80 lg:w-80"
            >
              <img
                src={entry.src}
                alt={entry.hotel.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="font-display text-lg leading-tight tracking-tight md:text-xl">
                  {entry.hotel.shortName ?? entry.hotel.name}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {entry.hotel.neighborhood}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
