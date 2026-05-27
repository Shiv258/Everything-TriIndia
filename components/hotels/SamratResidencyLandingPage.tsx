"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getHotelBySlug } from "@/lib/hotels";

const hotel = getHotelBySlug("hotel-samrat-residency")!;

const WHATSAPP_PHONE = hotel.phone ?? "+919899402024";
const PROMO_CODE = hotel.promoCode ?? "RETURN15";
const MAP_URL = hotel.mapEmbedUrl ?? "";
const COORDS = hotel.coordinates;

// Mapbox static image fallback (no scrollFrames on this hotel)
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const mapboxStaticUrl =
  MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+c39a57(${COORDS.lng},${COORDS.lat})/${COORDS.lng},${COORDS.lat},15,0/800x600@2x?access_token=${MAPBOX_TOKEN}`
    : null;

const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests", "5+ guests"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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

function AmenityIcon({ type }: { type: string }) {
  if (type === "wifi") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M8 18c9.4-8 22.6-8 32 0" /><path d="M14 25c5.8-5 14.2-5 20 0" /><path d="M20 32c2.4-2 5.6-2 8 0" /><circle cx="24" cy="38" r="2" /></svg>
      </span>
    );
  }
  if (type === "dining") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M10 25h28" /><path d="M14 25c.8-8 6.2-13 10-13s9.2 5 10 13" /><path d="M18 35h12" /><path d="M24 35V25" /><path d="M36 14v22" /><path d="M39 14v22" /></svg>
      </span>
    );
  }
  if (type === "bed") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M8 36V15" /><path d="M8 27h32v9" /><path d="M14 24h10v-6H14z" /><path d="M24 27h16v-3c0-3.3-2.7-6-6-6H24" /></svg>
      </span>
    );
  }
  if (type === "ac") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><rect x="8" y="14" width="32" height="12" rx="3" /><path d="M16 26v8" /><path d="M24 26v8" /><path d="M32 26v8" /><path d="M12 34l4-4" /><path d="M28 34l4-4" /><path d="M20 34l4-4" /></svg>
      </span>
    );
  }
  // reception / default
  return (
    <span className="amenity-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48"><path d="M16 18a8 8 0 0 1 16 0v7" /><path d="M13 25h22l-3 10H16z" /><path d="M20 39h8" /><path d="M36 18h4" /><path d="M8 18h4" /></svg>
    </span>
  );
}

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
      ...Array.from({ length: totalDays }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
  }, [month]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(month);

  const isDisabled = (day: Date) => {
    if (day < today) return true;
    if (minDate && day < minDate) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  };

  return (
    <div className="booking-calendar">
      <div className="booking-calendar__head">
        <button type="button" onClick={() => setMonth((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}>
          Prev
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" onClick={() => setMonth((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}>
          Next
        </button>
      </div>
      <div className="booking-calendar__weekdays">
        {weekdays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="booking-calendar__days">
        {days.map((day, i) => {
          if (!day) return <span key={`blank-${i}`} />;
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

function MapboxStaticImage() {
  if (!mapboxStaticUrl) {
    // Graceful fallback: styled placeholder map card
    return (
      <div className="map-plate" style={{ minHeight: 520, borderRadius: 42, display: "grid", placeItems: "center" }}>
        <div className="map-pin" />
        <div className="map-label">Bhogal, New Delhi</div>
        <div className="map-line map-line--one" />
        <div className="map-line map-line--two" />
        <div className="map-line map-line--three" />
      </div>
    );
  }
  return (
    <div
      style={{
        position: "relative",
        minHeight: 520,
        overflow: "hidden",
        borderRadius: 42,
        boxShadow: "var(--shadow)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mapboxStaticUrl}
        alt="Map showing Hotel Samrat Residency location in Bhogal, New Delhi"
        style={{ display: "block", width: "100%", height: "auto" }}
        loading="lazy"
      />
    </div>
  );
}

// ─── Gallery data built from samrth/ photos ───────────────────────────────────
const galleryItems = [
  {
    src: hotel.galleryImages[0] ?? hotel.heroImage,
    label: "Property Exterior",
    copy: "A landmark presence on Jangpura Road — spacious, approachable, and minutes from Nizamuddin.",
  },
  {
    src: hotel.galleryImages[1] ?? hotel.heroImage,
    label: "Guest Room",
    copy: "Generously sized rooms with clean finishes, warm lighting, and bedding built for a proper night's rest.",
  },
  {
    src: hotel.galleryImages[2] ?? hotel.heroImage,
    label: "Property Detail",
    copy: "Well-maintained common spaces, clear signage, and the kind of upkeep that earns repeat guests.",
  },
  {
    src: hotel.heroImage,
    label: "On-site Restaurant",
    copy: "Full-service dining on the ground floor — order in the morning or settle in for dinner without stepping outside.",
  },
];

// ─── Rooms fallback copy ───────────────────────────────────────────────────────
const hasRooms = hotel.rooms && hotel.rooms.length > 0;

// ─── Concierge bullets ─────────────────────────────────────────────────────────
const conciergeBullets = hotel.conciergeBlurb ?? [
  "Ask about room types, rates, check-in, or dining before you arrive.",
  "Get the map link and arrival guidance without searching through messages.",
  "Send simple requests faster: extra bedding, dining questions, or late arrival notes.",
  "Reception stays in control whenever a guest needs a real person.",
];

export default function SamratResidencyLandingPage() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Still-image hero (no heroVideo for this property)
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, reduceMotion ? 1 : 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.74]);

  const [scrolled, setScrolled] = useState(false);
  const [activePicker, setActivePicker] = useState<null | "arrival" | "departure" | "guests" | "room">(null);
  const [booking, setBooking] = useState({
    arrival: "Select date",
    departure: "Select date",
    guests: "2 guests",
    room: "Choose room",
  });
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  // Room modal state (only used when rooms array is populated)
  const [selectedRoom, setSelectedRoom] = useState<(typeof hotel.rooms)[0] | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [modalIndex, setModalIndex] = useState(0);

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(
      `Hi, I'd like to enquire about Hotel Samrat Residency.\nArrival: ${booking.arrival}\nDeparture: ${booking.departure}\nGuests: ${booking.guests}\nRoom: ${booking.room}\nPromo code: ${PROMO_CODE}`
    );
    return `https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, "")}?text=${text}`;
  }, [booking]);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({
      arrival: booking.arrival,
      departure: booking.departure,
      guests: booking.guests,
      room: booking.room,
    });
    return `/book/hotel-samrat-residency?${params.toString()}`;
  }, [booking]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function chooseRoom(roomName: string) {
    setBooking((c) => ({ ...c, room: roomName }));
    setActivePicker(null);
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
  }

  function openRoom(room: (typeof hotel.rooms)[0], image?: string) {
    setSelectedRoom(room);
    const img = image ?? room.heroImage;
    setSelectedImage(img);
    const idx = room.images.indexOf(img);
    setModalIndex(idx >= 0 ? idx : 0);
  }

  function nextImage() {
    if (!selectedRoom) return;
    const next = (modalIndex + 1) % selectedRoom.images.length;
    setModalIndex(next);
    setSelectedImage(selectedRoom.images[next]);
  }

  function prevImage() {
    if (!selectedRoom) return;
    const prev = (modalIndex - 1 + selectedRoom.images.length) % selectedRoom.images.length;
    setModalIndex(prev);
    setSelectedImage(selectedRoom.images[prev]);
  }

  const heroImageSrc = hotel.heroImage;

  return (
    <main className="site-shell">
      {/* ── 1. Fixed Navigation ─────────────────────────────────────────────── */}
      <nav
        className={`top-nav ${scrolled ? "top-nav--solid" : ""}`}
        aria-label="Hotel Samrat Residency page navigation"
      >
        <a className="nav-wordmark" href="#top" aria-label="Hotel Samrat Residency home">
          <span>S</span>
          <strong>Samrat Residency</strong>
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

      {/* ── 2. Full-screen still-image Hero (no heroVideo) ───────────────────── */}
      <section
        className="hero-video"
        aria-label="Hotel Samrat Residency — Bhogal, New Delhi"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: heroScale,
            opacity: heroOpacity,
            transformOrigin: "center",
          }}
        >
          <Image
            src={heroImageSrc}
            alt="Hotel Samrat Residency — spacious property in Bhogal, New Delhi"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
        {/* Subtle dark overlay for text legibility in nav */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(8,5,3,0.28) 0%, transparent 40%, rgba(8,5,3,0.14) 100%)",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ── 3. Reservation Stage ─────────────────────────────────────────────── */}
      <section id="reserve" className="reservation-stage">
        <Reveal>
          <div className="booking-card" aria-label="Reservation preview">
            <div className="booking-card__title">
              <span>Book direct at Hotel Samrat Residency</span>
              <strong>{PROMO_CODE}</strong>
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
                href={hasRooms ? bookingHref : whatsappHref}
                target={hasRooms ? undefined : "_blank"}
                rel="noreferrer"
              >
                Book Now
              </a>
            </div>

            {activePicker && (
              <div
                className={`booking-popover ${activePicker === "arrival" || activePicker === "departure" ? "calendar-popover" : ""}`}
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
                    <button type="button" onClick={() => setActivePicker(null)}>
                      Message us for availability
                    </button>
                  ))}
              </div>
            )}

            <p>
              Choose dates, guests, and a room type. The Book Now button sends a ready-to-send reservation message with{" "}
              {PROMO_CODE} included.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── 4. Intro Panel ───────────────────────────────────────────────────── */}
      <section className="intro-panel" id="top">
        <div className="intro-layout">
          <div>
            <Reveal>
              <div className="eyebrow">Hotel Samrat Residency / Bhogal, New Delhi</div>
              <h1>More room. Full-service restaurant. Central-Delhi access.</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="intro-copy">
                Hotel Samrat Residency gives guests something the smaller Delhi properties can&apos;t: genuinely spacious
                rooms, a full-service restaurant on the ground floor, and a TriIndia-operated front desk that knows the
                neighbourhood. The kind of base that works as well for families as it does for business travellers.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <div className="intro-image-card">
              <Image
                src={hotel.galleryImages[1] ?? heroImageSrc}
                alt="Hotel Samrat Residency room interior"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
              <span>Bhogal, New Delhi 110014</span>
            </div>
          </Reveal>
        </div>

        {/* ── 5. Amenity Strip ─────────────────────────────────────────────── */}
        <div className="amenity-strip" aria-label="Amenities">
          {hotel.amenities.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <button type="button" className="amenity-card">
                <AmenityIcon type={item.icon} />
                <span>{item.label}</span>
                <small>{item.detail ?? ""}</small>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6. Rooms & Prices ────────────────────────────────────────────────── */}
      <section id="rooms" className="rooms-section">
        <div className="section-kicker">Rooms &amp; prices</div>
        {hasRooms ? (
          <>
            <div className="rooms-heading">
              <Reveal>
                <h2>Spacious rooms for every kind of Delhi stay.</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Tap any room to open the full image gallery. Use &quot;Book this room&quot; to send that exact room
                  category into the booking panel.
                </p>
              </Reveal>
            </div>
            <div className="room-grid">
              {hotel.rooms.map((room, i) => (
                <Reveal key={room.slug} delay={i * 0.08}>
                  <article
                    className="room-card"
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ${room.name} gallery`}
                    onClick={() => openRoom(room)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") openRoom(room);
                    }}
                  >
                    <div className="room-card__image">
                      <Image
                        src={room.heroImage}
                        alt={`${room.name} at Hotel Samrat Residency`}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                      />
                    </div>
                    <div className="room-card__body">
                      <span>0{i + 1}</span>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            openRoom(room);
                          }}
                        >
                          View gallery
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            chooseRoom(room.name);
                          }}
                        >
                          Book this room
                        </button>
                      </div>
                    </div>
                    <div className="room-gallery" aria-label={`${room.name} image gallery preview`}>
                      <div>
                        <span>{room.images.length} photos</span>
                        <strong>Tap to open</strong>
                      </div>
                      <div className="room-gallery__grid">
                        {room.images.slice(0, 6).map((src, imgIdx) => (
                          <button
                            key={src}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRoom(room, src);
                            }}
                          >
                            <Image
                              src={src}
                              alt={`${room.name} preview ${imgIdx + 1}`}
                              width={180}
                              height={130}
                              sizes="180px"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          /* Graceful fallback when rooms array is empty */
          <Reveal>
            <div
              style={{
                maxWidth: 720,
                margin: "2rem auto 0",
                padding: "clamp(2rem, 5vw, 4rem) clamp(1.4rem, 4vw, 3.5rem)",
                border: "1px solid rgba(42,27,18,0.14)",
                borderRadius: 36,
                background:
                  "linear-gradient(135deg, rgba(255,249,238,0.88), rgba(239,222,196,0.72)), radial-gradient(circle at 12% 0%, rgba(195,154,87,0.18), transparent 18rem)",
                boxShadow: "var(--shadow)",
                textAlign: "center",
              }}
            >
              <div className="section-kicker" style={{ marginBottom: "1rem" }}>
                Rooms coming soon
              </div>
              <h2
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(2rem, 4vw, 3.4rem)",
                  fontWeight: 500,
                  color: "var(--coffee)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  margin: "0 0 1rem",
                }}
              >
                Message us for current availability and rates.
              </h2>
              <p
                style={{
                  maxWidth: 520,
                  margin: "0 auto 2rem",
                  color: "rgba(42,27,18,0.72)",
                  fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                  lineHeight: 1.55,
                }}
              >
                Hotel Samrat Residency has spacious rooms and an on-site restaurant. Room listings are being added — in
                the meantime, WhatsApp us directly for rates, availability, and group bookings.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I'd like to enquire about rooms at Hotel Samrat Residency.")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-grid",
                  minHeight: 54,
                  placeItems: "center",
                  padding: "0 1.4rem",
                  border: "1px solid rgba(240,202,132,0.5)",
                  borderRadius: 999,
                  color: "#140e09",
                  background: "var(--champagne)",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  boxShadow: "0 18px 48px rgba(195,154,87,0.16)",
                  textDecoration: "none",
                }}
              >
                Enquire about Hotel Samrat Residency
              </a>
            </div>
          </Reveal>
        )}
      </section>

      {/* ── 7. Property Gallery Story ────────────────────────────────────────── */}
      <section id="experience" className="gallery-story">
        <div className="sticky-copy">
          <div className="section-kicker">Inside the property</div>
          <h2>Spacious rooms, full restaurant, and the details that earn repeat guests.</h2>
          <p>
            Move through Samrat Residency the way a guest does: arrival, room, dining, then another night booked.
          </p>
        </div>
        <div className="gallery-stack">
          {galleryItems.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <figure className={`gallery-card gallery-card--${i + 1}`}>
                <Image
                  src={item.src}
                  alt={`${item.label} at Hotel Samrat Residency`}
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
                <figcaption>
                  <span>{item.label}</span>
                  <p>{item.copy}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 8. AI Concierge ──────────────────────────────────────────────────── */}
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
              AI concierge support is presented as a guest amenity: faster answers for room details, arrival help, dining
              questions, and restaurant reservations before reception takes over where human care is needed.
            </p>
          </Reveal>
          <div className="concierge-list">
            {conciergeBullets.map((item, i) => (
              <Reveal key={item} delay={i * 0.07}>
                <div>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Direct Booking Offer ──────────────────────────────────────────── */}
      <section className="offer-section">
        <Reveal>
          <div className="offer-card offer-card--refined">
            <div>
              <span className="section-kicker">Direct booking benefit</span>
              <h2>Use {PROMO_CODE} when booking direct.</h2>
              <p>
                Keep the offer close to the reservation flow. Choose your room above, send the booking request, and
                mention {PROMO_CODE} in the same message.
              </p>
              <a href="#reserve">Book with {PROMO_CODE}</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 10. Location — Mapbox Static Image (no scrollFrames) ─────────────── */}
      <section id="location" className="location-section">
        <Reveal>
          <div className="location-card">
            <MapboxStaticImage />
            <div className="location-copy">
              <div className="eyebrow">Location</div>
              <h2>{hotel.address}, Delhi {hotel.pincode}</h2>
              <p>
                Hotel Samrat Residency is in Bhogal — a short drive or auto ride from Nizamuddin Railway Station, and
                well-connected to central and south Delhi. Open the live route in Google Maps when you are ready to
                navigate.
              </p>
              {MAP_URL ? (
                <a href={MAP_URL} target="_blank" rel="noreferrer">
                  Open Google Maps
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Google Maps
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 11. Final Booking CTA ────────────────────────────────────────────── */}
      <section className="final-booking" aria-label="Book Hotel Samrat Residency">
        <Reveal>
          <div>
            <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
              <span className="section-kicker">Ready to stay?</span>
              <h2>Choose dates, compare rooms, and send your booking request.</h2>
              <a href="#reserve">Book Now</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 12. Footer ───────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-brand">
          <Image
            src={hotel.galleryImages[0] ?? heroImageSrc}
            alt="Hotel Samrat Residency"
            width={118}
            height={118}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <p>Hotel Samrat Residency by TriIndia Hospitality</p>
        </div>
        <div className="footer-signup">
          <h2>Direct booking updates, room offers, and Samrat Residency news.</h2>
          <form>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button">Notify me</button>
          </form>
        </div>
        <div className="footer-meta">
          <span>triindia.in/hotel-samrat-residency</span>
          <span>Bhogal, New Delhi 110014</span>
        </div>
      </footer>

      {/* ── Room Modal (used only when rooms are populated) ───────────────────── */}
      {selectedRoom && (
        <div className="room-modal" role="dialog" aria-modal="true" aria-label={`${selectedRoom.name} gallery`}>
          <button
            className="room-modal__backdrop"
            type="button"
            aria-label="Close gallery"
            onClick={() => setSelectedRoom(null)}
          />
          <div className="room-modal__panel">
            <button
              className="room-modal__close"
              type="button"
              onClick={() => setSelectedRoom(null)}
            >
              Close
            </button>
            <button className="modal-arrow modal-arrow--left" type="button" onClick={prevImage}>
              Prev
            </button>
            <button className="modal-arrow modal-arrow--right" type="button" onClick={nextImage}>
              Next
            </button>
            <div className="room-modal__image">
              <Image
                src={selectedImage || selectedRoom.heroImage}
                alt={`${selectedRoom.name} selected preview`}
                fill
                sizes="(max-width: 900px) 100vw, 70vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="room-modal__content">
              <span>{selectedRoom.rate} per night</span>
              <h2>{selectedRoom.name}</h2>
              <p>{selectedRoom.description}</p>
              <div className="room-modal__thumbs">
                {selectedRoom.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={i === modalIndex ? "is-active" : ""}
                    onClick={() => {
                      setModalIndex(i);
                      setSelectedImage(src);
                    }}
                  >
                    <Image src={src} alt={`${selectedRoom.name} thumbnail ${i + 1}`} width={110} height={78} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="room-modal__book"
                onClick={() => {
                  chooseRoom(selectedRoom.name);
                  setSelectedRoom(null);
                }}
              >
                Book this room
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
