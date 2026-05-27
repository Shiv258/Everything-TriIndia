"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getHotelBySlug } from "@/lib/hotels";

const hotel = getHotelBySlug("hotel-satwah-29")!;

const PHONE = hotel.phone ?? "+917428822220";
const PROMO = hotel.promoCode ?? "RETURN15";
const COORDS = hotel.coordinates;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Amenity Icons ─────────────────────────────────────────────────────────────

function AmenityIcon({ type }: { type: string }) {
  if (type === "bar") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M10 14h28l-6 14H16z" />
          <path d="M16 28v10" />
          <path d="M32 28v10" />
          <path d="M12 38h24" />
          <path d="M20 14c0-2.5 1.8-4 4-4s4 1.5 4 4" />
        </svg>
      </span>
    );
  }
  if (type === "dining") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M10 25h28" />
          <path d="M14 25c.8-8 6.2-13 10-13s9.2 5 10 13" />
          <path d="M18 35h12" />
          <path d="M24 35V25" />
          <path d="M36 14v22" />
          <path d="M39 14v22" />
        </svg>
      </span>
    );
  }
  if (type === "wifi") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M8 18c9.4-8 22.6-8 32 0" />
          <path d="M14 25c5.8-5 14.2-5 20 0" />
          <path d="M20 32c2.4-2 5.6-2 8 0" />
          <circle cx="24" cy="38" r="2" />
        </svg>
      </span>
    );
  }
  if (type === "reception") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M16 18a8 8 0 0 1 16 0v7" />
          <path d="M13 25h22l-3 10H16z" />
          <path d="M20 39h8" />
          <path d="M36 18h4" />
          <path d="M8 18h4" />
        </svg>
      </span>
    );
  }
  if (type === "parking") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <rect x="10" y="10" width="28" height="28" rx="6" />
          <path d="M19 34V14h7a6 6 0 0 1 0 12h-7" />
        </svg>
      </span>
    );
  }
  if (type === "breakfast") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M8 34h32" />
          <path d="M12 34V18a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v16" />
          <path d="M36 18c2.5 0 4 1.5 4 4v4h-4" />
          <path d="M20 24h8" />
        </svg>
      </span>
    );
  }
  // fallback
  return (
    <span className="amenity-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="14" />
        <path d="M24 17v7l5 3" />
      </svg>
    </span>
  );
}

// ─── Calendar Picker ────────────────────────────────────────────────────────────

function CalendarPicker({
  onSelect,
  minDate,
  maxDate,
}: {
  onSelect: (value: string, date: Date) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
}) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const firstDay = month.getDay();
    const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from(
        { length: totalDays },
        (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
      ),
    ];
  }, [month]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthLabel = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(month);

  const isDisabled = (day: Date) => {
    if (day < today) return true;
    if (minDate && day < minDate) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  };

  return (
    <div className="booking-calendar">
      <div className="booking-calendar__head">
        <button
          type="button"
          onClick={() =>
            setMonth((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
          }
        >
          Prev
        </button>
        <strong>{monthLabel}</strong>
        <button
          type="button"
          onClick={() =>
            setMonth((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
          }
        >
          Next
        </button>
      </div>
      <div className="booking-calendar__weekdays">
        {weekdays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="booking-calendar__days">
        {days.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;
          const disabled = isDisabled(day);
          const active = selectedDate ? sameDay(day, selectedDate) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              className={active ? "is-selected" : ""}
              onClick={() => {
                setSelectedDate(day);
                onSelect(formatDisplayDate(day), day);
              }}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mapbox Static Image Map ────────────────────────────────────────────────────

function MapboxStaticMap() {
  const { lat, lng } = COORDS;
  const pin = `pin-l+c39a57(${lng},${lat})`;
  const src = MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${pin}/${lng},${lat},15,0/800x600@2x?access_token=${MAPBOX_TOKEN}`
    : null;

  if (!src) {
    return (
      <div
        className="map-plate"
        style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-label="Hotel Satwah 29 location map"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textAlign: "center",
          }}
        >
          <div className="map-pin" />
          <div className="map-label">Hotel Satwah 29</div>
          <div className="map-line map-line--one" />
          <div className="map-line map-line--two" />
          <div className="map-line map-line--three" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 42,
        boxShadow: "var(--shadow)",
        minHeight: 520,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Map showing Hotel Satwah 29 location at 29 Church Road, Bhogal, New Delhi"
        style={{ width: "100%", height: "auto", display: "block" }}
        loading="lazy"
      />
    </div>
  );
}

// ─── Rooms Coming Soon Fallback ─────────────────────────────────────────────────

function RoomsComingSoon() {
  const whatsappUrl = `https://wa.me/${PHONE.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I'd like to enquire about room availability at Hotel Satwah 29.")}`;
  return (
    <div
      style={{
        maxWidth: 680,
        margin: "2rem auto 0",
        padding: "clamp(2rem,5vw,3.5rem)",
        border: "1px solid rgba(42,27,18,0.12)",
        borderRadius: 36,
        background: "rgba(255,249,238,0.78)",
        textAlign: "center",
        boxShadow: "0 22px 65px rgba(42,27,18,0.1)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 1.5rem",
          border: "1px solid rgba(173,123,51,0.34)",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "radial-gradient(circle at 35% 25%, rgba(195,154,87,0.16), transparent 58%)",
          color: "var(--gold)",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 36V15" /><path d="M8 27h32v9" /><path d="M14 24h10v-6H14z" /><path d="M24 27h16v-3c0-3.3-2.7-6-6-6H24" />
        </svg>
      </div>
      <h3
        style={{
          margin: "0 0 0.75rem",
          fontFamily: "var(--serif)",
          fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
          fontWeight: 500,
          letterSpacing: "-0.04em",
          color: "var(--coffee)",
        }}
      >
        Rooms coming soon.
      </h3>
      <p
        style={{
          margin: "0 0 2rem",
          color: "rgba(42,27,18,0.68)",
          fontSize: "clamp(1rem,1.6vw,1.2rem)",
          lineHeight: 1.55,
        }}
      >
        Room listing and photos are being prepared. Message us directly on WhatsApp for current availability, rates, and to hold a room.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-grid",
          minHeight: 54,
          placeItems: "center",
          padding: "0 1.6rem",
          border: "none",
          borderRadius: 999,
          color: "var(--paper)",
          background: "var(--espresso)",
          fontWeight: 900,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontSize: "0.82rem",
        }}
      >
        Enquire about Hotel Satwah 29
      </a>
    </div>
  );
}

// ─── Gallery Story Fallback (text-only) ────────────────────────────────────────

function PropertyStoryText() {
  const items = [
    {
      num: "01",
      title: "The Bar",
      body: "Hotel Satwah 29 is the only property in the TriIndia chain with a licensed in-house bar. A proper sit-down space — not a minibar in a corridor — for guests who want a drink after a long travel day without stepping outside Bhogal at night.",
    },
    {
      num: "02",
      title: "The Restaurant",
      body: "A full-service restaurant on the ground floor serves breakfast, lunch, and dinner. Familiar north-Indian comfort food alongside a short continental menu, plated in the hotel rather than packed and sent up.",
    },
    {
      num: "03",
      title: "The Coffee Shop",
      body: "Open from early morning until late evening, the on-site coffee shop covers everything from a 6 a.m. filter coffee before an early train to a quiet afternoon with a pastry between sightseeing legs.",
    },
    {
      num: "04",
      title: "The Building",
      body: "29 Church Road sits in the older Christian-colony pocket of Bhogal, where the quieter residential streets of south Delhi meet the Jangpura grid. Walking distance to Nizamuddin Railway Station, with easy auto and metered-taxi access to the rest of central Delhi.",
    },
  ];

  return (
    <div className="gallery-stack">
      {items.map((item, index) => (
        <Reveal key={item.num} delay={index * 0.07}>
          <div
            style={{
              position: "relative",
              minHeight: 220,
              padding: "clamp(1.6rem,4vw,2.8rem)",
              border: "1px solid rgba(255,249,238,0.12)",
              borderRadius: 38,
              background: "rgba(15,11,8,0.62)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.34)",
              transform:
                index % 2 === 1 ? "translateX(-7%)" : index === 2 ? "translateX(5%)" : undefined,
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "0.75rem",
                color: "#e5bf7e",
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              {item.num}
            </span>
            <h3
              style={{
                margin: "0 0 0.85rem",
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.7rem,3.2vw,2.8rem)",
                fontWeight: 500,
                letterSpacing: "-0.04em",
                color: "var(--paper)",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                margin: 0,
                color: "rgba(255,249,238,0.78)",
                lineHeight: 1.55,
                maxWidth: 600,
                fontSize: "clamp(1rem,1.5vw,1.18rem)",
              }}
            >
              {item.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Satwah29LandingPage() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero parallax — image since no video
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, reduceMotion ? 1 : 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.74]);

  const [scrolled, setScrolled] = useState(false);
  const [activePicker, setActivePicker] = useState<
    null | "arrival" | "departure" | "guests" | "room"
  >(null);
  const [booking, setBooking] = useState({
    arrival: "Select date",
    departure: "Select date",
    guests: "2 guests",
    room: "Choose room",
  });
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  // No rooms in lib yet → rooms fallback
  const hasRooms = hotel.rooms && hotel.rooms.length > 0;
  const hasGallery = hotel.galleryImages && hotel.galleryImages.length > 0;
  const hasVideo = Boolean(hotel.heroVideo);
  const isPlaceholderHero = hotel.heroImage.includes("J%20Residency");

  // Booking WhatsApp href (until /book/hotel-satwah-29 is wired)
  const bookingHref = useMemo(() => {
    const msg = [
      `Hi, I'd like to book a room at Hotel Satwah 29.`,
      `Arrival: ${booking.arrival}`,
      `Departure: ${booking.departure}`,
      `Guests: ${booking.guests}`,
      booking.room !== "Choose room" ? `Room: ${booking.room}` : "",
      `Promo: ${PROMO}`,
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  }, [booking]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const conciergeItems =
    hotel.conciergeBlurb && hotel.conciergeBlurb.length > 0
      ? hotel.conciergeBlurb
      : [
          "Ask about room types, rates, check-in, or dining before you arrive.",
          "Get the map link and arrival guidance without searching through messages.",
          "Send simple requests faster: extra bedding, dining questions, or late arrival notes.",
          "Reception stays in control whenever a guest needs a real person.",
        ];

  const mapsUrl =
    hotel.mapEmbedUrl ??
    `https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`;

  return (
    <main className="site-shell">
      {/* ─── 1. Fixed navigation ──────────────────────────────────────────── */}
      <nav
        className={`top-nav ${scrolled ? "top-nav--solid" : ""}`}
        aria-label="Hotel Satwah 29 page navigation"
      >
        <a className="nav-wordmark" href="#top" aria-label="Hotel Satwah 29 home">
          <span>S</span>
          <strong>Hotel Satwah 29</strong>
        </a>
        <div className="nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#experience">Property</a>
          <a href="#concierge">AI Concierge</a>
          <a href="#location">Location</a>
        </div>
        <a className="nav-cta" href="#reserve">
          Book Now
        </a>
      </nav>

      {/* ─── 2. Full-screen hero (image fallback with badge) ─────────────── */}
      <section
        className="hero-video"
        ref={heroRef}
        aria-label="Hotel Satwah 29 property exterior"
        style={{ minHeight: 620 }}
      >
        {hasVideo ? (
          <motion.video
            className="hero-video__media"
            style={{ scale: heroScale, opacity: heroOpacity }}
            src={hotel.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <motion.div
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src={hotel.heroImage}
              alt="Hotel Satwah 29"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", transformOrigin: "center" }}
            />
          </motion.div>
        )}
        {/* Photography coming soon badge — shown when hero is a placeholder */}
        {isPlaceholderHero && (
          <div
            aria-label="Photography placeholder notice"
            style={{
              position: "absolute",
              top: "1.2rem",
              right: "1.2rem",
              zIndex: 10,
              padding: "0.6rem 1rem",
              border: "1px solid rgba(240,202,132,0.45)",
              borderRadius: 999,
              color: "#f0ca84",
              background: "rgba(15,11,8,0.72)",
              backdropFilter: "blur(14px)",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Photography coming soon
          </div>
        )}
      </section>

      {/* ─── 3. Reservation stage ────────────────────────────────────────── */}
      <section id="reserve" className="reservation-stage">
        <Reveal>
          <div className="booking-card" aria-label="Reservation preview">
            <div className="booking-card__title">
              <span>Book direct at Hotel Satwah 29</span>
              <strong>{PROMO}</strong>
            </div>
            <div className="booking-grid">
              <button
                type="button"
                className="booking-field"
                onClick={() => setActivePicker(activePicker === "arrival" ? null : "arrival")}
              >
                <span>Arrival</span>
                <strong>{booking.arrival}</strong>
              </button>
              <button
                type="button"
                className="booking-field"
                onClick={() => setActivePicker(activePicker === "departure" ? null : "departure")}
              >
                <span>Departure</span>
                <strong>{booking.departure}</strong>
              </button>
              <button
                type="button"
                className="booking-field"
                onClick={() => setActivePicker(activePicker === "guests" ? null : "guests")}
              >
                <span>Guests</span>
                <strong>{booking.guests}</strong>
              </button>
              <button
                type="button"
                className="booking-field"
                onClick={() => setActivePicker(activePicker === "room" ? null : "room")}
              >
                <span>Room Type</span>
                <strong>{booking.room}</strong>
              </button>
              <a
                className="booking-button"
                href={bookingHref}
                target="_blank"
                rel="noreferrer"
              >
                Book Now
              </a>
            </div>

            {activePicker && (
              <div
                className={`booking-popover ${
                  activePicker === "arrival" || activePicker === "departure"
                    ? "calendar-popover"
                    : ""
                }`}
              >
                {activePicker === "arrival" && (
                  <CalendarPicker
                    onSelect={(value, date) => {
                      setBooking((c) => ({ ...c, arrival: value }));
                      setArrivalDate(date);
                      setActivePicker(null);
                    }}
                    maxDate={departureDate}
                  />
                )}
                {activePicker === "departure" && (
                  <CalendarPicker
                    onSelect={(value, date) => {
                      setBooking((c) => ({ ...c, departure: value }));
                      setDepartureDate(date);
                      setActivePicker(null);
                    }}
                    minDate={arrivalDate}
                  />
                )}
                {activePicker === "guests" &&
                  guestOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setBooking((c) => ({ ...c, guests: opt }));
                        setActivePicker(null);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                {activePicker === "room" &&
                  (hasRooms ? (
                    hotel.rooms.map((room) => (
                      <button
                        key={room.slug}
                        type="button"
                        onClick={() => {
                          setBooking((c) => ({ ...c, room: room.name }));
                          setActivePicker(null);
                        }}
                      >
                        {room.name} <span>{room.rate}</span>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setBooking((c) => ({ ...c, room: "Standard Room" }));
                        setActivePicker(null);
                      }}
                    >
                      Standard Room <span>Rates on request</span>
                    </button>
                  ))}
              </div>
            )}

            <p>
              Choose dates, guests, and a room type. The Book Now button opens a ready-to-send
              WhatsApp reservation message with {PROMO} included.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ─── 4. Intro panel ──────────────────────────────────────────────── */}
      <section className="intro-panel" id="top">
        <div className="intro-layout">
          <div>
            <Reveal>
              <div className="eyebrow">Hotel Satwah 29 / 29 Church Road, Bhogal</div>
              <h1>
                Bar, coffee shop, restaurant — and a short walk to Nizamuddin Railway Station.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="intro-copy">
                {hotel.description[0]}
              </p>
            </Reveal>
            {hotel.description[1] && (
              <Reveal delay={0.18}>
                <p className="intro-copy" style={{ marginTop: "1rem" }}>
                  {hotel.description[1]}
                </p>
              </Reveal>
            )}
          </div>
          <Reveal delay={0.16}>
            <div className="intro-image-card">
              <Image
                src={hotel.heroImage}
                alt="Hotel Satwah 29 — 29 Church Road, Bhogal, New Delhi"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
              {isPlaceholderHero && (
                <span
                  style={{
                    position: "absolute",
                    zIndex: 3,
                    right: "1.2rem",
                    top: "1.2rem",
                    padding: "0.52rem 0.8rem",
                    border: "1px solid rgba(255,249,238,0.24)",
                    borderRadius: 999,
                    color: "var(--paper)",
                    background: "rgba(15,11,8,0.56)",
                    backdropFilter: "blur(16px)",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Photo placeholder
                </span>
              )}
              <span>Bhogal, New Delhi</span>
            </div>
          </Reveal>
        </div>

        {/* ─── 5. Amenity strip ─────────────────────────────────────────── */}
        <div className="amenity-strip" aria-label="Amenities">
          {hotel.amenities.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <button type="button" className="amenity-card">
                <AmenityIcon type={item.icon} />
                <span>{item.label}</span>
                <small>
                  {item.detail ??
                    (item.icon === "bar"
                      ? "The only in-house bar in the TriIndia chain. Full selection, open to guests."
                      : item.icon === "dining"
                      ? "Full-service sit-down restaurant on the ground floor."
                      : item.icon === "breakfast"
                      ? "Daily breakfast from the on-site coffee shop and restaurant."
                      : item.icon === "parking"
                      ? "On-site parking available for guests driving in."
                      : "")}
                </small>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── 6. Rooms section (with fallback) ───────────────────────────── */}
      <section id="rooms" className="rooms-section">
        <div className="section-kicker">Rooms &amp; prices</div>
        <div className="rooms-heading">
          <Reveal>
            <h2>
              {hasRooms
                ? "Pick the room that matches the trip."
                : "Rooms being prepared for direct booking."}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              {hasRooms
                ? "Tap any room to open the full image gallery. Use “Book this room” to send that exact room category into the booking panel."
                : "Bar on-site, restaurant, coffee shop — this is the most complete property in the TriIndia chain. Message us directly to confirm room availability, rates, and your preferred dates."}
            </p>
          </Reveal>
        </div>

        {hasRooms ? (
          <div className="room-grid">
            {hotel.rooms.map((room, index) => (
              <Reveal key={room.slug} delay={index * 0.08}>
                <article
                  className="room-card"
                  tabIndex={0}
                  role="button"
                  aria-label={`${room.name} at Hotel Satwah 29`}
                >
                  <div className="room-card__image">
                    <Image
                      src={room.heroImage}
                      alt={`${room.name} at Hotel Satwah 29`}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  </div>
                  <div className="room-card__body">
                    <span>0{index + 1}</span>
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <div className="rate-line">
                      <div>
                        <strong>{room.rate}</strong>
                        {room.originalRate && (
                          <small className="rate-original">{room.originalRate}</small>
                        )}
                      </div>
                      {room.discount && (
                        <small className="rate-discount">{room.discount} off</small>
                      )}
                    </div>
                    <div className="room-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setBooking((c) => ({ ...c, room: room.name }));
                          document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Book this room
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <RoomsComingSoon />
        )}
      </section>

      {/* ─── 7. Property gallery / story ────────────────────────────────── */}
      <section id="experience" className="gallery-story">
        <div className="sticky-copy">
          <div className="section-kicker">Inside the property</div>
          <h2>
            {hasGallery
              ? "Reception, lounge, rooms, and the details guests actually notice."
              : "The bar, restaurant, and coffee shop — all under one roof."}
          </h2>
          <p>
            {hasGallery
              ? "Move through the hotel the way a guest does: first impression, common spaces, room decision, then booking."
              : "Hotel Satwah 29 is the only property in the TriIndia chain where guests can start the day with a coffee, eat three meals in the building, and end the evening at the bar — without stepping outside. Photography of the property is coming soon."}
          </p>
        </div>

        {hasGallery ? (
          <div className="gallery-stack">
            {hotel.galleryImages.map((src, index) => (
              <Reveal key={src} delay={index * 0.05}>
                <figure className={`gallery-card gallery-card--${index + 1}`}>
                  <Image
                    src={src}
                    alt={`Hotel Satwah 29 property photo ${index + 1}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 58vw"
                  />
                  <figcaption>
                    <span>Photo {index + 1}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <PropertyStoryText />
        )}
      </section>

      {/* ─── 8. AI Concierge ────────────────────────────────────────────── */}
      <section id="concierge" className="concierge-section">
        <Reveal>
          <div className="concierge-media concierge-media--ai">
            <div className="ai-visual" aria-hidden="true">
              <div className="ai-visual__mesh" />
              <div className="ai-visual__core" />
              <div className="ai-visual__ring" />
              <div className="ai-visual__ring ai-visual__ring--two" />
            </div>
            <div className="ai-pulse" />
            <div className="ai-card ai-card--one">Ask before you arrive</div>
            <div className="ai-card ai-card--two">Reception follows through</div>
          </div>
        </Reveal>
        <div className="concierge-copy">
          <Reveal>
            <div className="eyebrow">AI Concierge Amenity</div>
            <h2>Questions answered faster, without replacing hospitality.</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p>
              AI concierge support is presented as a guest amenity: faster answers for room details,
              arrival help, dining questions, and common stay requests before reception takes over
              where human care is needed. Ask about the bar hours, coffee shop timings, or restaurant
              menu before you arrive.
            </p>
          </Reveal>
          <div className="concierge-list">
            {conciergeItems.map((item, index) => (
              <Reveal key={item} delay={index * 0.07}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Direct booking offer ────────────────────────────────────── */}
      <section className="offer-section">
        <Reveal>
          <div className="offer-card offer-card--refined">
            <div>
              <span className="section-kicker">Direct booking benefit</span>
              <h2>Use {PROMO} when booking direct.</h2>
              <p>
                Keep the offer close to the reservation flow. Choose arrival and departure dates
                above, then send the booking request with {PROMO} already included in the message.
                Bar on-site, restaurant, coffee shop — book direct and mention the code.
              </p>
              <a href="#reserve">Book with {PROMO}</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 10. Location with Mapbox static image ──────────────────────── */}
      <section id="location" className="location-section">
        <Reveal>
          <div className="location-card" style={{ maxWidth: 1220, margin: "0 auto" }}>
            <MapboxStaticMap />
            <div className="location-copy">
              <div className="eyebrow">Location</div>
              <h2>{hotel.address}, New Delhi {hotel.pincode}</h2>
              <p>
                29 Church Road is in Bhogal — the older Christian-colony pocket of south Delhi —
                walking distance from Nizamuddin Railway Station and well connected by auto, Uber,
                and metered taxi to the rest of central Delhi. Open the live route in Google Maps
                when you are ready to navigate.
              </p>
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                Open Google Maps
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 11. Final booking CTA ──────────────────────────────────────── */}
      <section className="final-booking" aria-label="Book Hotel Satwah 29">
        <Reveal>
          <div>
            <div>
              <span className="section-kicker">Ready to stay?</span>
              <h2>Choose dates, check availability, and send your booking request.</h2>
              <a href="#reserve">Book Now</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 12. Footer ─────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-brand">
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: "50%",
              background: "var(--paper)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: "3.2rem",
                fontWeight: 400,
                color: "var(--coffee)",
                lineHeight: 1,
              }}
              aria-label="Satwah 29 monogram"
            >
              S
            </span>
          </div>
          <p>Hotel Satwah 29 by TriIndia Hospitality</p>
        </div>
        <div className="footer-signup">
          <h2>Direct booking updates, room offers, and Satwah 29 news.</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button">Notify me</button>
          </form>
        </div>
        <div className="footer-meta">
          <span>triindia.in/hotel-satwah-29</span>
          <span>Google Maps route ready</span>
        </div>
      </footer>
    </main>
  );
}
