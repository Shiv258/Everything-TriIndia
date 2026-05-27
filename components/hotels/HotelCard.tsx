/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import type { Hotel } from "@/lib/hotels";

interface Props {
  hotel: Hotel;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: Props) {
  const cover = hotel.galleryImages[0] ?? hotel.heroImage;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <Link
        href={`/hotels/${hotel.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.25)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={cover}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl leading-tight tracking-tight text-neutral-950">
            {hotel.shortName ?? hotel.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-neutral-500">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{hotel.neighborhood}, New Delhi</span>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">
            {hotel.tagline}
          </p>

          <div className="mt-6 flex items-center justify-end">
            <span className="group/btn inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-950 transition-all">
              View hotel
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
