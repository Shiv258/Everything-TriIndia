/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Wifi,
  Bed,
  Utensils,
  Bell,
  Car,
  Snowflake,
  Tv,
  Sparkles,
  GlassWater,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import type { Amenity, Hotel } from "@/lib/hotels";

const amenityIcons: Record<Amenity["icon"], React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  bed: Bed,
  dining: Utensils,
  reception: Bell,
  parking: Car,
  ac: Snowflake,
  tv: Tv,
  laundry: Sparkles,
  spa: Sparkles,
  bar: GlassWater,
  breakfast: Coffee,
};

interface Props {
  hotel: Hotel;
}

export default function HotelDetailTemplate({ hotel }: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = hotel.galleryImages.length > 0 ? hotel.galleryImages : [hotel.heroImage];

  const phoneHref = hotel.phone ? `tel:${hotel.phone}` : undefined;
  const whatsappHref = hotel.phone
    ? `https://wa.me/${hotel.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hi! I'd like to enquire about a stay at ${hotel.name}.`,
      )}`
    : undefined;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main>
        <section className="relative h-[78vh] min-h-[600px] w-full overflow-hidden">
          <img
            src={gallery[0]}
            alt={hotel.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-20 text-white">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-5 text-[11px] uppercase tracking-[0.36em] text-white/70"
            >
              TriIndia Hospitality · {hotel.neighborhood}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] tracking-tight"
            >
              {hotel.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
            >
              {hotel.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-neutral-950 transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  Enquire on WhatsApp
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/55 hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  Call reception
                </a>
              )}
              {!whatsappHref && !phoneHref && (
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/55 hover:bg-white/10"
                >
                  Contact TriIndia
                </Link>
              )}
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[1.15fr,1fr]">
            <div>
              <span className="mb-5 block text-[11px] uppercase tracking-[0.36em] text-neutral-400">
                About the property
              </span>
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.08] tracking-tight text-neutral-950">
                Designed for a real night&apos;s sleep, central to the city.
              </h2>
              <div className="mt-7 space-y-4 text-[15px] leading-relaxed text-neutral-500">
                {hotel.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <span>{hotel.address}</span>
                </div>
                {hotel.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    <a href={`tel:${hotel.phone}`} className="hover:text-neutral-950">
                      {hotel.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {hotel.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity.icon] ?? Bell;
                return (
                  <div
                    key={amenity.label}
                    className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5 transition-all hover:border-neutral-200 hover:bg-white"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-medium text-neutral-950">
                      {amenity.label}
                    </div>
                    {amenity.detail && (
                      <div className="mt-1 text-[12px] leading-snug text-neutral-500">
                        {amenity.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="bg-neutral-50 py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
              <span className="mb-5 block text-[11px] uppercase tracking-[0.36em] text-neutral-400">
                Gallery
              </span>
              <h2 className="mb-12 font-display text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.08] tracking-tight text-neutral-950">
                Inside the property.
              </h2>

              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryIndex}
                    src={gallery[galleryIndex]}
                    alt={`${hotel.name} — gallery ${galleryIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous"
                      onClick={() =>
                        setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length)
                      }
                      className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
                    >
                      <ChevronLeft className="h-5 w-5 text-neutral-950" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next"
                      onClick={() => setGalleryIndex((i) => (i + 1) % gallery.length)}
                      className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
                    >
                      <ChevronRight className="h-5 w-5 text-neutral-950" />
                    </button>
                  </>
                )}

                {gallery.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Show image ${i + 1}`}
                        onClick={() => setGalleryIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === galleryIndex ? "w-7 bg-white" : "w-2 bg-white/55"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {(hotel.mapEmbedUrl || hotel.address) && (
          <section className="bg-white py-20 md:py-28">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr,1.1fr]">
              <div className="flex flex-col justify-center">
                <span className="mb-5 block text-[11px] uppercase tracking-[0.36em] text-neutral-400">
                  Location
                </span>
                <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.08] tracking-tight text-neutral-950">
                  {hotel.neighborhood}, near Nizamuddin Railway.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-500">
                  {hotel.address}
                </p>
                {hotel.mapEmbedUrl && (
                  <a
                    href={hotel.mapEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-neutral-950 transition-all hover:border-neutral-400"
                  >
                    Open in Google Maps
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
              <div className="rounded-3xl bg-neutral-100 p-3 shadow-sm">
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-neutral-200">
                  {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
                    <img
                      src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+c39a57(${hotel.coordinates.lng},${hotel.coordinates.lat})/${hotel.coordinates.lng},${hotel.coordinates.lat},15,0/800x600@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                      alt={`Map showing ${hotel.name}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center text-neutral-500">
                      <MapPin className="mx-auto mb-3 h-8 w-8" />
                      <div className="font-display text-base text-neutral-700">
                        {hotel.coordinates.lat.toFixed(4)}°N, {hotel.coordinates.lng.toFixed(4)}°E
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        Add NEXT_PUBLIC_MAPBOX_TOKEN to enable map
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
