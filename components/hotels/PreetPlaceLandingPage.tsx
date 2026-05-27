"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getHotelBySlug } from "@/lib/hotels";

const FALLBACK_PHONE = "+919899402024";
const PROMO_CODE = "RETURN15";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
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

function AmenityIcon({ type }: { type: string }) {
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
  if (type === "ac") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <rect x="6" y="14" width="36" height="14" rx="4" />
          <path d="M14 28v8" />
          <path d="M24 28v8" />
          <path d="M34 28v8" />
          <path d="M10 22h28" />
        </svg>
      </span>
    );
  }
  if (type === "parking") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <rect x="8" y="8" width="32" height="32" rx="6" />
          <path d="M18 34V14h8c4 0 7 2.7 7 7s-3 7-7 7h-8" />
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
  if (type === "laundry") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <rect x="8" y="8" width="32" height="36" rx="4" />
          <circle cx="24" cy="28" r="8" />
          <path d="M12 14h6" />
          <circle cx="30" cy="14" r="2" />
        </svg>
      </span>
    );
  }
  // Fallback generic icon
  return (
    <span className="amenity-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="16" />
        <path d="M24 16v8l6 4" />
      </svg>
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
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
        >
          Prev
        </button>
        <strong>{monthLabel}</strong>
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
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

function MapboxStaticImage({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  const token = MAPBOX_TOKEN;
  if (token) {
    const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+c39a57(${lng},${lat})/${lng},${lat},15,0/800x600@2x?access_token=${token}`;
    return (
      <div
        style={{
          position: "relative",
          minHeight: "520px",
          overflow: "hidden",
          borderRadius: "42px",
          boxShadow: "var(--shadow)",
          background: "#19100b",
        }}
      >
        <Image
          src={src}
          alt={`Map showing location of ${label}`}
          fill
          sizes="(max-width: 1040px) 100vw, 55vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  // No token — CSS-only decorative map placeholder
  return (
    <div className="map-plate">
      <div className="map-pin" />
      <span className="map-label">{label}</span>
      <div className="map-line map-line--one" />
      <div className="map-line map-line--two" />
      <div className="map-line map-line--three" />
    </div>
  );
}

export default function PreetPlaceLandingPage() {
  const hotel = getHotelBySlug("hotel-preet-place");

  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const heroImageScale = useTransform(scrollYProgress, [0, 0.18], [1, reduceMotion ? 1 : 1.08]);
  const heroImageOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.74]);

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

  const phone = hotel?.phone ?? FALLBACK_PHONE;
  const hotelName = hotel?.name ?? "Hotel Preet Place";
  const hotelAddress = hotel?.address ?? "Block C, Jangpura B, New Delhi";
  const hotelTagline = hotel?.tagline ?? "Five minutes on foot to Nizamuddin Railway Station. AC rooms, sound-insulated walls.";
  const hotelDescription = hotel?.description ?? [];
  const hotelAmenities = hotel?.amenities ?? [];
  const hotelRooms = hotel?.rooms ?? [];
  const heroImage = hotel?.heroImage ?? "/main-images/Preet.jpeg";
  const galleryImages = hotel?.galleryImages ?? [];
  const coords = hotel?.coordinates ?? { lat: 28.5808, lng: 77.2425 };

  const conciergeBlurb: string[] = hotel?.conciergeBlurb?.length
    ? hotel.conciergeBlurb
    : [
        "Ask about room types, rates, check-in, or dining before you arrive.",
        "Get the map link and arrival guidance without searching through messages.",
        "Send simple requests faster: extra bedding, dining questions, or late arrival notes.",
        "Reception stays in control whenever a guest needs a real person.",
      ];

  const whatsappHref = (message: string) =>
    `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  const bookingWhatsappHref = useMemo(() => {
    const message = `Hi, I'd like to enquire about Hotel Preet Place.\n\nArrival: ${booking.arrival}\nDeparture: ${booking.departure}\nGuests: ${booking.guests}\nRoom: ${booking.room}\n\nPromo code: ${PROMO_CODE}`;
    return whatsappHref(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking, phone]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasRooms = hotelRooms.length > 0;

  // Build gallery items from available photos
  const galleryStory = galleryImages.slice(0, 4).map((src, i) => {
    const labels = [
      { label: "Property View", copy: "A clean, well-maintained exterior in Jangpura B — five minutes on foot from Nizamuddin Railway Station." },
      { label: "Guest Room", copy: "Sound-insulated walls, AC, and clean bedding — the essentials done properly for travellers who need a real night's sleep." },
      { label: "Room Detail", copy: "Well-fitted rooms with all the practical comforts: WiFi, working AC, and a quiet space to wind down after Delhi." },
      { label: "Property Detail", copy: "A property that has been refreshed for long-haul travellers — sturdy, clean, and free from the wear of cheaper options." },
    ];
    return { src, ...(labels[i] ?? { label: `View ${i + 1}`, copy: "" }) };
  });

  return (
    <main className="site-shell">
      {/* 1. Fixed navigation */}
      <nav
        className={`top-nav ${scrolled ? "top-nav--solid" : ""}`}
        aria-label="Hotel Preet Place page navigation"
      >
        <a className="nav-wordmark" href="#top" aria-label="Hotel Preet Place home">
          <span>P</span>
          <strong>Preet Place</strong>
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

      {/* 2. Full-screen hero — still image with parallax (no heroVideo) */}
      <section
        ref={heroRef}
        className="hero-video"
        aria-label="Hotel Preet Place exterior and property view"
        style={{ position: "relative" }}
      >
        <motion.div
          style={{
            scale: heroImageScale,
            opacity: heroImageOpacity,
            position: "absolute",
            inset: 0,
            transformOrigin: "center",
          }}
        >
          <Image
            src={heroImage}
            alt="Hotel Preet Place, Jangpura B, New Delhi"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
        {/* Subtle bottom gradient matching .hero-video::after */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "auto 0 0",
            height: "22%",
            background: "linear-gradient(180deg, transparent, rgba(7,5,4,0.26))",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* 3. Reservation stage */}
      <section id="reserve" className="reservation-stage">
        <Reveal>
          <div className="booking-card" aria-label="Reservation preview">
            <div className="booking-card__title">
              <span>Book direct at Hotel Preet Place</span>
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
                href={bookingWhatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                Book Now
              </a>
            </div>

            {activePicker && (
              <div
                className={`booking-popover ${
                  activePicker === "arrival" || activePicker === "departure" ? "calendar-popover" : ""
                }`}
              >
                {activePicker === "arrival" && (
                  <CalendarPicker
                    onSelect={(value, date) => {
                      setBooking((b) => ({ ...b, arrival: value }));
                      setArrivalDate(date);
                      setActivePicker(null);
                    }}
                    maxDate={departureDate}
                  />
                )}
                {activePicker === "departure" && (
                  <CalendarPicker
                    onSelect={(value, date) => {
                      setBooking((b) => ({ ...b, departure: value }));
                      setDepartureDate(date);
                      setActivePicker(null);
                    }}
                    minDate={arrivalDate}
                  />
                )}
                {activePicker === "guests" &&
                  guestOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setBooking((b) => ({ ...b, guests: option }));
                        setActivePicker(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                {activePicker === "room" &&
                  (hasRooms ? (
                    hotelRooms.map((room) => (
                      <button
                        key={room.slug}
                        type="button"
                        onClick={() => {
                          setBooking((b) => ({ ...b, room: room.name }));
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
                        setBooking((b) => ({ ...b, room: "Standard Room" }));
                        setActivePicker(null);
                      }}
                    >
                      Standard Room <span>Ask for rates</span>
                    </button>
                  ))}
              </div>
            )}

            <p>
              Choose dates, guests, and a room type. The Book Now button opens a ready-to-send
              WhatsApp enquiry with {PROMO_CODE} included.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 4. Intro panel */}
      <section className="intro-panel" id="top">
        <div className="intro-layout">
          <div>
            <Reveal>
              <div className="eyebrow">Hotel Preet Place / {hotelAddress}</div>
              <h1>{hotelTagline}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              {hotelDescription.map((para, i) => (
                <p key={i} className="intro-copy">
                  {para}
                </p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <div className="intro-image-card">
              <Image
                src={galleryImages[1] ?? heroImage}
                alt="Hotel Preet Place room interior"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
              <span>Jangpura B, New Delhi</span>
            </div>
          </Reveal>
        </div>

        {/* 5. Amenity strip */}
        {hotelAmenities.length > 0 && (
          <div className="amenity-strip" aria-label="Amenities">
            {hotelAmenities.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.06}>
                <button type="button" className="amenity-card">
                  <AmenityIcon type={item.icon} />
                  <span>{item.label}</span>
                  {item.detail && <small>{item.detail}</small>}
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* 6. Rooms section — graceful fallback for empty rooms[] */}
      <section id="rooms" className="rooms-section">
        <div className="section-kicker">Rooms &amp; prices</div>
        <div className="rooms-heading">
          <Reveal>
            <h2>{hasRooms ? "Pick the room that matches the trip." : "Sound-insulated AC rooms, five minutes from the station."}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              {hasRooms
                ? "Tap any room to open the full image gallery. Use \"Book this room\" to send that exact room category into the booking panel."
                : "Room listings are being updated. Message us on WhatsApp for current availability, rates, and to hold a room directly."}
            </p>
          </Reveal>
        </div>

        {hasRooms ? (
          <div className="room-grid">
            {hotelRooms.map((room, i) => (
              <Reveal key={room.slug} delay={i * 0.08}>
                <article
                  className="room-card"
                  tabIndex={0}
                  role="button"
                  aria-label={`${room.name} at Hotel Preet Place`}
                >
                  <div className="room-card__image">
                    <Image
                      src={room.heroImage}
                      alt={`${room.name} at Hotel Preet Place`}
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
                          setBooking((b) => ({ ...b, room: room.name }));
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
          /* Rooms coming soon card */
          <Reveal>
            <div
              style={{
                maxWidth: "780px",
                margin: "0 auto",
                padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem)",
                border: "1px solid rgba(42,27,18,0.13)",
                borderRadius: "36px",
                background:
                  "linear-gradient(135deg, rgba(255,249,238,0.92), rgba(239,222,196,0.72))",
                boxShadow: "var(--shadow)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  border: "1px solid rgba(173,123,51,0.34)",
                  background: "radial-gradient(circle at 35% 25%, rgba(195,154,87,0.16), transparent 58%)",
                  marginBottom: "1.5rem",
                }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 48 48"
                  width="34"
                  height="34"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 36V15" />
                  <path d="M8 27h32v9" />
                  <path d="M14 24h10v-6H14z" />
                  <path d="M24 27h16v-3c0-3.3-2.7-6-6-6H24" />
                </svg>
              </div>
              <h3
                style={{
                  margin: "0 0 0.8rem",
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  color: "var(--coffee)",
                  lineHeight: 1,
                }}
              >
                Rooms coming soon.
              </h3>
              <p
                style={{
                  maxWidth: "520px",
                  margin: "0 auto 2rem",
                  color: "rgba(42,27,18,0.7)",
                  fontSize: "clamp(1.05rem, 1.8vw, 1.22rem)",
                  lineHeight: 1.55,
                }}
              >
                We&apos;re updating the room listings for Hotel Preet Place. Message us on WhatsApp
                to check current availability and hold a room at the direct-booking rate.
              </p>
              <a
                href={whatsappHref(
                  `Hi, I'd like to enquire about Hotel Preet Place — please share current room availability and rates. Promo: ${PROMO_CODE}`
                )}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-grid",
                  minHeight: "54px",
                  placeItems: "center",
                  padding: "0 1.6rem",
                  border: "0",
                  borderRadius: "999px",
                  color: "var(--paper)",
                  background: "var(--espresso)",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: "0.84rem",
                  boxShadow: "0 18px 45px rgba(21,16,11,0.18)",
                }}
              >
                Enquire about Hotel Preet Place
              </a>
            </div>
          </Reveal>
        )}
      </section>

      {/* 7. Property gallery story */}
      {galleryStory.length > 0 && (
        <section id="experience" className="gallery-story">
          <div className="sticky-copy">
            <div className="section-kicker">Inside the property</div>
            <h2>The rooms, the location, and the details that matter on a Delhi stay.</h2>
            <p>
              Sound-insulated walls, working AC, free WiFi, free parking — and a front desk that
              answers. A practical property done right in Jangpura B.
            </p>
          </div>
          <div className="gallery-stack">
            {galleryStory.map((item, i) => (
              <Reveal key={item.src} delay={i * 0.05}>
                <figure className={`gallery-card gallery-card--${i + 1}`}>
                  <Image
                    src={item.src}
                    alt={`${item.label} at Hotel Preet Place`}
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
      )}

      {/* 8. AI Concierge */}
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
              AI concierge support is available as a guest amenity: faster answers for room details,
              arrival help, dining questions, and common stay requests — before reception takes over
              where human care is needed.
            </p>
          </Reveal>
          <div className="concierge-list">
            {conciergeBlurb.map((item, i) => (
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

      {/* 9. Direct booking offer card */}
      <section className="offer-section">
        <Reveal>
          <div className="offer-card offer-card--refined">
            <div>
              <span className="section-kicker">Direct booking benefit</span>
              <h2>Use {PROMO_CODE} when booking direct.</h2>
              <p>
                Choose dates above, send the booking request on WhatsApp, and mention {PROMO_CODE}{" "}
                in the same message. Direct bookings skip the OTA markup — the saving stays with you.
              </p>
              <a href="#reserve">Book with {PROMO_CODE}</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 10. Location — Mapbox static image (scrollFrames !== true) */}
      <section id="location" className="location-section">
        <Reveal>
          <div className="location-card">
            <MapboxStaticImage lat={coords.lat} lng={coords.lng} label="Hotel Preet Place" />
            <div className="location-copy">
              <div className="eyebrow">Location</div>
              <h2>{hotelAddress}, Delhi {hotel?.pincode ?? "110014"}</h2>
              <p>
                Five minutes on foot to Nizamuddin Railway Station. Khan Market is a short
                rickshaw ride away. Easy taxi and auto access to central Delhi from the front gate.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Open Google Maps
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 11. Final booking CTA */}
      <section className="final-booking" aria-label="Book Hotel Preet Place">
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

      {/* 12. Footer */}
      <footer className="site-footer">
        <div className="footer-brand">
          <Image
            src={galleryImages[0] ?? heroImage}
            alt="Hotel Preet Place"
            width={118}
            height={118}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <p>Hotel Preet Place by TriIndia Hospitality</p>
        </div>
        <div className="footer-signup">
          <h2>Direct booking updates, room offers, and Preet Place news.</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button">Notify me</button>
          </form>
        </div>
        <div className="footer-meta">
          <span>triindia.in/hotels/hotel-preet-place</span>
          <span>Jangpura B · 5 min walk to Nizamuddin Railway Station</span>
        </div>
      </footer>
    </main>
  );
}
