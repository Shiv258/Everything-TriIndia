/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Hotel } from "@/lib/hotels";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface Props {
  hotels: Hotel[];
  height?: string;
  initialZoom?: number;
  className?: string;
}

function centroid(hotels: Hotel[]): { lat: number; lng: number } {
  if (hotels.length === 0) return { lat: 28.6139, lng: 77.209 };
  const lat = hotels.reduce((s, h) => s + h.coordinates.lat, 0) / hotels.length;
  const lng = hotels.reduce((s, h) => s + h.coordinates.lng, 0) / hotels.length;
  return { lat, lng };
}

export default function HotelsMap({
  hotels,
  height = "560px",
  initialZoom = 13.5,
  className,
}: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const initialCenter = useRef(centroid(hotels)).current;

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={`flex items-center justify-center rounded-3xl bg-neutral-100 text-sm text-neutral-500 ${className ?? ""}`}
        style={{ height }}
      >
        Map unavailable — NEXT_PUBLIC_MAPBOX_TOKEN missing.
      </div>
    );
  }

  const active = hotels.find((h) => h.slug === activeSlug) ?? null;

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className ?? ""}`} style={{ height }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: initialCenter.lng,
          latitude: initialCenter.lat,
          zoom: initialZoom,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        attributionControl={false}
        cooperativeGestures
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {hotels.map((hotel) => (
          <Marker
            key={hotel.slug}
            longitude={hotel.coordinates.lng}
            latitude={hotel.coordinates.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveSlug(hotel.slug);
            }}
          >
            <button
              type="button"
              aria-label={`Show ${hotel.name}`}
              onMouseEnter={() => setActiveSlug(hotel.slug)}
              className="group relative block cursor-pointer"
            >
              <motion.span
                className="absolute left-1/2 top-1/2 -z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c39a57]/35"
                animate={{ scale: [1, 1.7, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-[#c39a57] shadow-[0_4px_14px_rgba(195,154,87,0.55)] transition-transform duration-200 group-hover:scale-125" />
            </button>
          </Marker>
        ))}

        {active && (
          <Popup
            longitude={active.coordinates.lng}
            latitude={active.coordinates.lat}
            anchor="top"
            onClose={() => setActiveSlug(null)}
            closeButton={false}
            closeOnClick={false}
            offset={18}
            maxWidth="280px"
            className="triindia-popup"
          >
            <Link
              href={`/hotels/${active.slug}`}
              className="group block w-[240px] overflow-hidden rounded-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                {(active.galleryImages[0] || active.heroImage) && (
                  <img
                    src={active.galleryImages[0] || active.heroImage}
                    alt={active.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-3">
                <div className="font-display text-base leading-tight tracking-tight text-neutral-950">
                  {active.shortName ?? active.name}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  {active.neighborhood}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-950">
                  View hotel
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </Popup>
        )}
      </Map>

      <style>{`
        .triindia-popup .mapboxgl-popup-content {
          padding: 0;
          background: transparent;
          box-shadow: 0 24px 56px -22px rgba(15, 23, 42, 0.35);
          border-radius: 12px;
        }
        .triindia-popup .mapboxgl-popup-tip { display: none; }
      `}</style>
    </div>
  );
}
