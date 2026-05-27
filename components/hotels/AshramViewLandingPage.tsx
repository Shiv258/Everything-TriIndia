"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getHotelBySlug } from "@/lib/hotels";

const hotel = getHotelBySlug("hotel-ashram-view")!;

const WHATSAPP_PHONE = "+919899402024";
const PROMO_CODE = "RETURN15";
const MAPS_URL = "https://maps.app.goo.gl/8cPr2FGJvxPzCaDY8";

const defaultConcierge = [
  "Ask about room types, rates, check-in, or parking before you arrive.",
  "Get the map link and arrival guidance without searching through messages.",
  "Send simple requests faster: extra bedding, dining questions, or late arrival notes.",
  "Reception stays in control whenever a guest needs a real person.",
];

const conciergeBlurb = hotel.conciergeBlurb ?? defaultConcierge;

const galleryData = hotel.detailGallery ?? hotel.galleryImages.map((src, i) => ({
  src,
  label: i === 0 ? "Exterior View" : i === 1 ? "Property Entrance" : "Interior",
  copy: i === 0
    ? "Modern build, clean lines, and a quiet residential address in Siddhartha Enclave."
    : i === 1
    ? "Secure entry, natural light, and easy access from Ashram Metro Gate 2."
    : "Well-fitted interiors with modern amenities and fresh finishes throughout.",
}));

const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests"];
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
  if (type === "parking") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><rect x="10" y="10" width="28" height="28" rx="4" /><path d="M20 22h5a4 4 0 0 1 0 8h-5V22z" /><path d="M20 30v8" /></svg>
      </span>
    );
  }
  if (type === "ac") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="16" rx="4" /><path d="M16 32v6" /><path d="M32 32v6" /><path d="M12 24h24" /><path d="M24 18v-4" /><path d="M24 32v4" /></svg>
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

function CalendarPicker({ onSelect, minDate, maxDate }: { onSelect: (value: string, date: Date) => void; minDate?: Date | null; maxDate?: Date | null }) {
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const firstDay = month.getDay();
    const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: totalDays }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1))];
  }, [month]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
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
        <button type="button" onClick={() => setMonth((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}>Prev</button>
        <strong>{monthLabel}</strong>
        <button type="button" onClick={() => setMonth((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}>Next</button>
      </div>
      <div className="booking-calendar__weekdays">{weekdays.map((d) => <span key={d}>{d}</span>)}</div>
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
              onClick={() => { setSelectedDate(day); onSelect(formatDisplayDate(day), day); }}
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
  const { lat, lng } = hotel.coordinates;
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapUrl = token
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+c39a57(${lng},${lat})/${lng},${lat},15,0/800x600@2x?access_token=${token}`
    : null;

  return (
    <div className="map-plate" style={{ position: "relative", minHeight: 520, borderRadius: 42, overflow: "hidden" }}>
      {mapUrl ? (
        <Image
          src={mapUrl}
          alt={`Map showing Hotel Ashram View location in Siddhartha Enclave, New Delhi`}
          fill
          sizes="(max-width: 1040px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          unoptimized
        />
      ) : (
        <>
          <div className="map-pin" />
          <div className="map-label">Hotel Ashram View</div>
          <div className="map-line map-line--one" />
          <div className="map-line map-line--two" />
          <div className="map-line map-line--three" />
        </>
      )}
    </div>
  );
}

function buildWhatsAppHref(booking: { arrival: string; departure: string; guests: string; room: string }) {
  const msg = encodeURIComponent(
    `Hello, I'd like to enquire about Hotel Ashram View.\n\nArrival: ${booking.arrival}\nDeparture: ${booking.departure}\nGuests: ${booking.guests}\nRoom preference: ${booking.room}\n\nPromo code: ${PROMO_CODE}`
  );
  return `https://wa.me/${WHATSAPP_PHONE.replace("+", "")}?text=${msg}`;
}

export default function AshramViewLandingPage() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, reduceMotion ? 1 : 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.74]);

  const [scrolled, setScrolled] = useState(false);
  const [activePicker, setActivePicker] = useState<null | "arrival" | "departure" | "guests" | "room">(null);
  const [booking, setBooking] = useState({ arrival: "Select date", departure: "Select date", guests: "2 guests", room: "Choose room" });
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  const whatsappHref = useMemo(() => buildWhatsAppHref(booking), [booking]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroImageSrc = hotel.heroImage;

  return (
    <main className="site-shell">
      {/* ── 1. Fixed navigation ── */}
      <nav className={`top-nav ${scrolled ? "top-nav--solid" : ""}`} aria-label="Hotel Ashram View page navigation">
        <a className="nav-wordmark" href="#top" aria-label="Hotel Ashram View home">
          <span>A</span>
          <strong>Ashram View</strong>
        </a>
        <div className="nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#experience">Property</a>
          <a href="#concierge">AI Concierge</a>
          <a href="#location">Location</a>
        </div>
        <a className="nav-cta" href="#reserve">Book Now</a>
      </nav>

      {/* ── 2. Full-screen still hero (no heroVideo on this property) ── */}
      <section ref={heroRef} className="hero-video" aria-label="Hotel Ashram View — Siddhartha Enclave, New Delhi">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, position: "absolute", inset: 0 }}
        >
          <Image
            src={heroImageSrc}
            alt="Hotel Ashram View exterior — Siddhartha Enclave, New Delhi"
            fill
            priority
            sizes="100vw"
            className="hero-video__media"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </section>

      {/* ── 3. Reservation stage ── */}
      <section id="reserve" className="reservation-stage">
        <Reveal>
          <div className="booking-card" aria-label="Reservation enquiry">
            <div className="booking-card__title">
              <span>Enquire about Hotel Ashram View</span>
              <strong>{PROMO_CODE}</strong>
            </div>
            <div className="booking-grid">
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "arrival" ? null : "arrival")}>
                <span>Arrival</span>
                <strong>{booking.arrival}</strong>
              </button>
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "departure" ? null : "departure")}>
                <span>Departure</span>
                <strong>{booking.departure}</strong>
              </button>
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "guests" ? null : "guests")}>
                <span>Guests</span>
                <strong>{booking.guests}</strong>
              </button>
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "room" ? null : "room")}>
                <span>Room Type</span>
                <strong>{booking.room}</strong>
              </button>
              <a className="booking-button" href={whatsappHref} target="_blank" rel="noreferrer">Book Now</a>
            </div>

            {activePicker && (
              <div className={`booking-popover ${activePicker === "arrival" || activePicker === "departure" ? "calendar-popover" : ""}`}>
                {activePicker === "arrival" && (
                  <CalendarPicker
                    onSelect={(value, date) => { setBooking((c) => ({ ...c, arrival: value })); setArrivalDate(date); setActivePicker(null); }}
                    maxDate={departureDate}
                  />
                )}
                {activePicker === "departure" && (
                  <CalendarPicker
                    onSelect={(value, date) => { setBooking((c) => ({ ...c, departure: value })); setDepartureDate(date); setActivePicker(null); }}
                    minDate={arrivalDate}
                  />
                )}
                {activePicker === "guests" && guestOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => { setBooking((c) => ({ ...c, guests: opt })); setActivePicker(null); }}>{opt}</button>
                ))}
                {activePicker === "room" && (
                  <button type="button" onClick={() => { setBooking((c) => ({ ...c, room: "Standard Room" })); setActivePicker(null); }}>
                    Standard Room <span>Contact for rates</span>
                  </button>
                )}
              </div>
            )}

            <p>Choose dates and guests, then tap Book Now to send your enquiry via WhatsApp with {PROMO_CODE} included.</p>
          </div>
        </Reveal>
      </section>

      {/* ── 4. Intro panel ── */}
      <section className="intro-panel" id="top">
        <div className="intro-layout">
          <div>
            <Reveal>
              <div className="eyebrow">{hotel.shortName} / {hotel.neighborhood}</div>
              <h1>{hotel.tagline}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="intro-copy">{hotel.description[0]}</p>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <div className="intro-image-card">
              <Image
                src={hotel.galleryImages[1] ?? hotel.heroImage}
                alt="Hotel Ashram View — property entrance"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
              <span>Siddhartha Enclave, New Delhi</span>
            </div>
          </Reveal>
        </div>

        {/* ── 5. Amenity strip ── */}
        <div className="amenity-strip" aria-label="Amenities">
          {hotel.amenities.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <button type="button" className="amenity-card">
                <AmenityIcon type={item.icon} />
                <span>{item.label}</span>
                <small>{item.detail ?? ""}</small>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6. Rooms section — graceful fallback (no rooms data yet) ── */}
      <section id="rooms" className="rooms-section">
        <div className="section-kicker">Rooms &amp; prices</div>
        <div className="rooms-heading">
          <Reveal><h2>Modern rooms in a quiet Delhi address.</h2></Reveal>
          <Reveal delay={0.1}><p>Full room details and pricing are being finalised. Message us directly for current availability and to secure your dates.</p></Reveal>
        </div>
        <Reveal delay={0.14}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1rem, 4vw, 4.5rem)",
            borderRadius: 36,
            border: "1px solid rgba(42,27,18,0.11)",
            background: "rgba(255,249,238,0.72)",
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
            boxShadow: "0 22px 65px rgba(42,27,18,0.09)",
          }}>
            <p style={{ margin: 0, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", lineHeight: 1.5, color: "var(--coffee)" }}>
              Room listing coming soon — message us for current availability at Hotel Ashram View.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE.replace("+", "")}?text=${encodeURIComponent("Hello, I'd like to enquire about room availability at Hotel Ashram View.")}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-grid",
                minHeight: 54,
                placeItems: "center",
                padding: "0 1.4rem",
                borderRadius: 999,
                border: "1px solid rgba(173,123,51,0.42)",
                color: "var(--paper)",
                background: "var(--espresso)",
                fontWeight: 900,
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Enquire about Hotel Ashram View
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── 7. Property gallery story ── */}
      <section id="experience" className="gallery-story">
        <div className="sticky-copy">
          <div className="section-kicker">Inside the property</div>
          <h2>The newest build in the TriIndia portfolio.</h2>
          <p>Opened in 2024, Hotel Ashram View brings modern fittings and a residential calm to central south Delhi — without the central-Delhi noise.</p>
        </div>
        <div className="gallery-stack">
          {galleryData.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.05}>
              <figure className={`gallery-card gallery-card--${index + 1}`}>
                <Image
                  src={item.src}
                  alt={`${item.label ?? "Hotel Ashram View"} — property photo`}
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
                <figcaption>
                  <span>{item.label ?? `Photo ${index + 1}`}</span>
                  <p>{item.copy ?? ""}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 8. AI Concierge ── */}
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
            <p>AI concierge support is presented as a guest amenity: faster answers for room details, arrival help, parking guidance, and common stay requests — before reception takes over where human care is needed.</p>
          </Reveal>
          <div className="concierge-list">
            {conciergeBlurb.map((item, index) => (
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

      {/* ── 9. Direct booking offer ── */}
      <section className="offer-section">
        <Reveal>
          <div className="offer-card offer-card--refined">
            <div>
              <span className="section-kicker">Direct booking benefit</span>
              <h2>Use {PROMO_CODE} when booking direct.</h2>
              <p>Keep the offer close to the reservation flow. Send your enquiry via WhatsApp and mention {PROMO_CODE} in the same message — our team will apply it to your booking.</p>
              <a href="#reserve">Book with {PROMO_CODE}</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 10. Location (Mapbox static image, no scroll frames) ── */}
      <section id="location" className="location-section">
        <Reveal>
          <div className="location-card">
            <MapboxStaticImage />
            <div className="location-copy">
              <div className="eyebrow">Location</div>
              <h2>{hotel.address}, Delhi {hotel.pincode}</h2>
              <p>{hotel.description[1]}</p>
              <a href={MAPS_URL} target="_blank" rel="noreferrer">Open Google Maps</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 11. Final booking CTA ── */}
      <section className="final-booking" aria-label="Book Hotel Ashram View">
        <Reveal>
          <div>
            <div>
              <span className="section-kicker">Ready to stay?</span>
              <h2>Choose dates and send your booking request.</h2>
              <a href="#reserve">Book Now</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 12. Footer ── */}
      <footer className="site-footer">
        <div className="footer-brand">
          <Image
            src={hotel.heroImage}
            alt="Hotel Ashram View"
            width={118}
            height={118}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <p>Hotel Ashram View by TriIndia Hospitality</p>
        </div>
        <div className="footer-signup">
          <h2>Direct booking updates and Hotel Ashram View news.</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button">Notify me</button>
          </form>
        </div>
        <div className="footer-meta">
          <span>triindiahospitality.com</span>
          <span>Ashram Metro · 2 min walk</span>
        </div>
      </footer>
    </main>
  );
}
