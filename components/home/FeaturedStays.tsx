"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedHotels, type Hotel } from "@/lib/hotels";

const featured = getFeaturedHotels(4);

function fallbackImages(hotel: Hotel): string[] {
  if (hotel.galleryImages.length > 0) return hotel.galleryImages;
  return [hotel.heroImage];
}

export default function FeaturedStays() {
  const [imageIndices, setImageIndices] = useState<Record<string, number>>(
    Object.fromEntries(featured.map((h) => [h.slug, 0])),
  );

  const advance = (slug: string, total: number, delta: number) => {
    setImageIndices((prev) => ({
      ...prev,
      [slug]: (prev[slug] + delta + total) % total,
    }));
  };

  return (
    <section id="rooms" className="w-full overflow-hidden bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col gap-3"
        >
          <span className="text-[11px] uppercase tracking-[0.36em] text-neutral-400">
            Featured properties
          </span>
          <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-tight text-neutral-950">
            Hand-picked from our Delhi portfolio.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((hotel, index) => {
            const images = fallbackImages(hotel);
            const idx = imageIndices[hotel.slug] ?? 0;
            return (
              <motion.div
                key={hotel.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.25)]">
                  <Link href={`/hotels/${hotel.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                    <AnimatePresence mode="wait">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <motion.img
                        key={idx}
                        src={images[idx]}
                        alt={hotel.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                      />
                    </AnimatePresence>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            advance(hotel.slug, images.length, -1);
                          }}
                          className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-4 w-4 text-neutral-800" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            advance(hotel.slug, images.length, 1);
                          }}
                          className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
                        >
                          <ChevronRight className="h-4 w-4 text-neutral-800" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {images.map((_, i) => (
                            <span
                              key={i}
                              className={`block h-1.5 rounded-full transition-all duration-300 ${
                                i === idx ? "w-5 bg-white" : "w-1.5 bg-white/55"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg leading-tight tracking-tight text-neutral-950">
                      {hotel.shortName ?? hotel.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1 text-neutral-500">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{hotel.neighborhood}, New Delhi</span>
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <Link
                        href={`/hotels/${hotel.slug}`}
                        className="group/btn inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-950 transition-all hover:gap-2"
                      >
                        View hotel
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
