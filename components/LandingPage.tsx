"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface Room {
  name: string;
  rate: string;
  originalRate: string;
  discount: string;
  slug: string;
  tone: string;
  heroImage: string;
  images: string[];
}

const deluxeImages = [1, 2, 3, 4].map((n) => `/jresidency/rooms/deluxe/${n}.jpeg`);
const studioImages = [1, 2, 3, 4, 5, 6].map((n) => `/jresidency/rooms/studio/${n}.jpeg`);
const executiveImages = [1, 2, 3, 4, 5, 6, 7].map((n) => `/jresidency/rooms/executive-suite/${n}.jpeg`);
const familyImages = [1, 2, 3, 4].map((n) => `/jresidency/rooms/family-suite/${n}.jpeg`);

const rooms: Room[] = [
  {
    name: "Deluxe Room",
    rate: "₹1,999",
    originalRate: "₹2,999",
    discount: "33%",
    slug: "deluxe",
    tone: "Compact, clean, and easy for short Delhi stays.",
    heroImage: deluxeImages[0],
    images: deluxeImages,
  },
  {
    name: "Studio Room",
    rate: "₹1,999",
    originalRate: "₹2,999",
    discount: "33%",
    slug: "studio",
    tone: "A practical studio-style room with a calmer residential feel.",
    heroImage: studioImages[0],
    images: studioImages,
  },
  {
    name: "Executive Attached Suite Room",
    rate: "₹2,499",
    originalRate: "₹3,499",
    discount: "29%",
    slug: "executive-suite",
    tone: "More breathing space with an attached suite layout for longer stays.",
    heroImage: executiveImages[1],
    images: executiveImages,
  },
  {
    name: "Family Suite Premium Room",
    rate: "₹4,499",
    originalRate: "₹6,499",
    discount: "31%",
    slug: "family-suite",
    tone: "The larger premium choice for families and group travel.",
    heroImage: familyImages[2],
    images: familyImages,
  },
];

const amenities = [
  { label: "Free WiFi", icon: "wifi", detail: "Fast connection for work, calls, and travel planning." },
  { label: "Luxury Rooms", icon: "bed", detail: "Clean rooms with polished finishes and comfortable bedding." },
  { label: "In-House Dining", icon: "dining", detail: "Food support inside the property without stepping out." },
  { label: "24/7 Reception", icon: "reception", detail: "Front-desk support for arrivals, stays, and questions." },
];

const gallery = [
  { src: "/jresidency/reception-area.jpeg", label: "Reception", copy: "Chandelier light, marble flooring, and a front desk built for quick arrivals." },
  { src: "/jresidency/sitting-area.jpeg", label: "Sitting Area", copy: "Teal lounge seating, gold table frames, wall art, and a quiet pause before the room." },
  { src: "/jresidency/bedroom-blue.jpeg", label: "Guest Room Detail", copy: "Crisp linen, paneled walls, and a clean room setup for business and leisure stays." },
  { src: "/jresidency/bedroom-red.jpeg", label: "Warm Suite Detail", copy: "Wood textures, warm sconces, and a softer room mood for families and longer nights in Delhi." },
];

const concierge = [
  "Ask about room types, rates, check-in, or dining before you arrive.",
  "Get the map link and arrival guidance without searching through messages.",
  "Send simple requests faster: extra bedding, dining questions, or late arrival notes.",
  "Reception stays in control whenever a guest needs a real person.",
];

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
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 34 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
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
  if (type === "bed") {
    return (
      <span className="amenity-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M8 36V15" /><path d="M8 27h32v9" /><path d="M14 24h10v-6H14z" /><path d="M24 27h16v-3c0-3.3-2.7-6-6-6H24" /></svg>
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

  const isDisabled = (day: Date) => { if (day < today) return true; if (minDate && day < minDate) return true; if (maxDate && day > maxDate) return true; return false; };

  return (
    <div className="booking-calendar">
      <div className="booking-calendar__head">
        <button type="button" onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>Prev</button>
        <strong>{monthLabel}</strong>
        <button type="button" onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>Next</button>
      </div>
      <div className="booking-calendar__weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="booking-calendar__days">
        {days.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;
          const disabled = isDisabled(day);
          const active = selectedDate ? sameDay(day, selectedDate) : false;
          return (
            <button key={day.toISOString()} type="button" disabled={disabled} className={active ? "is-selected" : ""} onClick={() => { setSelectedDate(day); onSelect(formatDisplayDate(day), day); }}>
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScrollFrameMap() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const updateFrame = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      const nextFrame = Math.min(61, Math.max(1, Math.round(progress * 60) + 1));
      setFrame((current) => (current === nextFrame ? current : nextFrame));
    };
    updateFrame();
    window.addEventListener("scroll", updateFrame, { passive: true });
    window.addEventListener("resize", updateFrame);
    return () => { window.removeEventListener("scroll", updateFrame); window.removeEventListener("resize", updateFrame); };
  }, []);

  const frameSrc = `/jresidency/map-frames/frame-${String(frame).padStart(3, "0")}.jpg`;

  return (
    <div ref={targetRef} className="map-frame-stage" style={{ position: "relative" }}>
      <div className="map-frame-card">
        <Image src={frameSrc} alt="Animated map route to J Residency" width={1108} height={828} priority={frame < 3} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 0.18], [1, reduceMotion ? 1 : 1.08]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.74]);
  const [scrolled, setScrolled] = useState(false);
  const [activePicker, setActivePicker] = useState<null | "arrival" | "departure" | "guests" | "room">(null);
  const [booking, setBooking] = useState({ arrival: "Select date", departure: "Select date", guests: "2 guests", room: "Choose room" });
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [modalIndex, setModalIndex] = useState(0);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({
      arrival: booking.arrival,
      departure: booking.departure,
      guests: booking.guests,
      room: booking.room,
    });
    return `/book/j-residency?${params.toString()}`;
  }, [booking]);

  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 40); handleScroll(); window.addEventListener("scroll", handleScroll, { passive: true }); return () => window.removeEventListener("scroll", handleScroll); }, []);

  function chooseRoom(roomName: string) { setBooking((current) => ({ ...current, room: roomName })); setActivePicker(null); document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" }); }
  function openRoom(room: Room, image = room.heroImage) { setSelectedRoom(room); setSelectedImage(image); const idx = room.images.indexOf(image); setModalIndex(idx >= 0 ? idx : 0); }
  function nextImage() { if (!selectedRoom) return; const next = (modalIndex + 1) % selectedRoom.images.length; setModalIndex(next); setSelectedImage(selectedRoom.images[next]); }
  function prevImage() { if (!selectedRoom) return; const prev = (modalIndex - 1 + selectedRoom.images.length) % selectedRoom.images.length; setModalIndex(prev); setSelectedImage(selectedRoom.images[prev]); }

  return (
    <main className="site-shell">
      <nav className={`top-nav ${scrolled ? "top-nav--solid" : ""}`} aria-label="J Residency page navigation">
        <a className="nav-wordmark" href="#top" aria-label="J Residency home"><span>J</span><strong>J Residency</strong></a>
        <div className="nav-links"><a href="#rooms">Rooms</a><a href="#experience">Property</a><a href="#concierge">AI Concierge</a><a href="#location">Location</a></div>
        <a className="nav-cta" href="#reserve">Book Now</a>
      </nav>

      <section className="hero-video" aria-label="J Residency cinematic hotel film">
        <motion.video className="hero-video__media" style={{ scale: videoScale, opacity: videoOpacity }} src="/jresidency/hero-video.mp4" autoPlay muted loop playsInline preload="metadata" />
      </section>

      <section id="reserve" className="reservation-stage">
        <Reveal>
          <div className="booking-card" aria-label="Reservation preview">
            <div className="booking-card__title"><span>Book direct at J Residency</span><strong>RETURN15</strong></div>
            <div className="booking-grid">
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "arrival" ? null : "arrival")}><span>Arrival</span><strong>{booking.arrival}</strong></button>
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "departure" ? null : "departure")}><span>Departure</span><strong>{booking.departure}</strong></button>
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "guests" ? null : "guests")}><span>Guests</span><strong>{booking.guests}</strong></button>
              <button type="button" className="booking-field" onClick={() => setActivePicker(activePicker === "room" ? null : "room")}><span>Room Type</span><strong>{booking.room}</strong></button>
              <a className="booking-button" href={bookingHref} target="_blank" rel="noreferrer">Book Now</a>
            </div>

            {activePicker && (
              <div className={`booking-popover ${activePicker === "arrival" || activePicker === "departure" ? "calendar-popover" : ""}`}>
                {activePicker === "arrival" && <CalendarPicker onSelect={(value, date) => { setBooking((current) => ({ ...current, arrival: value })); setArrivalDate(date); setActivePicker(null); }} maxDate={departureDate} />}
                {activePicker === "departure" && <CalendarPicker onSelect={(value, date) => { setBooking((current) => ({ ...current, departure: value })); setDepartureDate(date); setActivePicker(null); }} minDate={arrivalDate} />}
                {activePicker === "guests" && guestOptions.map((option) => <button key={option} type="button" onClick={() => { setBooking((current) => ({ ...current, guests: option })); setActivePicker(null); }}>{option}</button>)}
                {activePicker === "room" && rooms.map((room) => <button key={room.slug} type="button" onClick={() => { setBooking((current) => ({ ...current, room: room.name })); setActivePicker(null); }}>{room.name} <span>{room.rate}</span></button>)}
              </div>
            )}

            <p>Choose dates, guests, and a room type. The Book Now button opens a ready-to-send reservation message with RETURN15 included.</p>
          </div>
        </Reveal>
      </section>

      <section className="intro-panel" id="top">
        <div className="intro-layout">
          <div>
            <Reveal><div className="eyebrow">J Residency / 51, Block B, Jangpura B</div><h1>Stay close to South Delhi with rooms that keep travel simple.</h1></Reveal>
            <Reveal delay={0.12}><p className="intro-copy">J Residency gives guests a clean room, helpful reception, in-house dining, and a clear path to book direct. No overcomplication. Just a better base for Delhi.</p></Reveal>
          </div>
          <Reveal delay={0.16}>
            <div className="intro-image-card">
              <Image src="/jresidency/sitting-area.jpeg" alt="J Residency sitting area" fill sizes="(max-width: 900px) 100vw, 38vw" />
              <span>Jangpura B, New Delhi</span>
            </div>
          </Reveal>
        </div>
        <div className="amenity-strip" aria-label="Amenities">
          {amenities.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <button type="button" className="amenity-card"><AmenityIcon type={item.icon} /><span>{item.label}</span><small>{item.detail}</small></button>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="rooms" className="rooms-section">
        <div className="section-kicker">Rooms & prices</div>
        <div className="rooms-heading">
          <Reveal><h2>Pick the room that matches the trip.</h2></Reveal>
          <Reveal delay={0.1}><p>Tap any room to open the full image gallery. Use &quot;Book this room&quot; to send that exact room category into the booking panel.</p></Reveal>
        </div>
        <div className="room-grid">
          {rooms.map((room, index) => (
            <Reveal key={room.slug} delay={index * 0.08}>
              <article className="room-card" tabIndex={0} role="button" aria-label={`Open ${room.name} gallery`} onClick={() => openRoom(room)} onKeyDown={(event) => { if (event.key === "Enter") openRoom(room); }}>
                <div className="room-card__image"><Image src={room.heroImage} alt={`${room.name} at J Residency`} fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
                <div className="room-card__body">
                  <span>0{index + 1}</span>
                  <h3>{room.name}</h3>
                  <p>{room.tone}</p>
                  <div className="rate-line">
                    <div><strong>{room.rate}</strong><small className="rate-original">{room.originalRate}</small></div>
                    <small className="rate-discount">{room.discount} off</small>
                  </div>
                  <div className="room-actions">
                    <button type="button" onClick={(event) => { event.stopPropagation(); openRoom(room); }}>View gallery</button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); chooseRoom(room.name); }}>Book this room</button>
                  </div>
                </div>
                <div className="room-gallery" aria-label={`${room.name} image gallery preview`}>
                  <div><span>{room.images.length} photos</span><strong>Tap to open</strong></div>
                  <div className="room-gallery__grid">
                    {room.images.slice(0, 6).map((src, imageIndex) => (
                      <button key={src} type="button" onClick={(event) => { event.stopPropagation(); openRoom(room, src); }}>
                        <Image src={src} alt={`${room.name} preview ${imageIndex + 1}`} width={180} height={130} sizes="180px" />
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="experience" className="gallery-story">
        <div className="sticky-copy">
          <div className="section-kicker">Inside the property</div>
          <h2>Reception, lounge, rooms, and the details guests actually notice.</h2>
          <p>Move through the hotel the way a guest does: first impression, waiting space, room decision, then booking.</p>
        </div>
        <div className="gallery-stack">
          {gallery.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.05}>
              <figure className={`gallery-card gallery-card--${index + 1}`}>
                <Image src={item.src} alt={`${item.label} at J Residency`} fill sizes="(max-width: 900px) 100vw, 58vw" />
                <figcaption><span>{item.label}</span><p>{item.copy}</p></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

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
          <Reveal><div className="eyebrow">AI Concierge Amenity</div><h2>Questions answered faster, without replacing hospitality.</h2></Reveal>
          <Reveal delay={0.12}><p>AI concierge support is presented as a guest amenity: faster answers for room details, arrival help, dining questions, and common stay requests before reception takes over where human care is needed.</p></Reveal>
          <div className="concierge-list">
            {concierge.map((item, index) => (
              <Reveal key={item} delay={index * 0.07}><div><span>{String(index + 1).padStart(2, "0")}</span>{item}</div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="offer-section">
        <Reveal>
          <div className="offer-card offer-card--refined">
            <div>
              <span className="section-kicker">Direct booking benefit</span>
              <h2>Use RETURN15 when booking direct.</h2>
              <p>Keep the offer close to the reservation flow. Guests can choose a room above, send the booking request, and mention RETURN15 in the same message.</p>
              <a href="#reserve">Book with RETURN15</a>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="location" className="location-section location-section--video">
        <Reveal>
          <div className="location-card location-card--video">
            <ScrollFrameMap />
            <div className="location-copy">
              <div className="eyebrow">Location</div>
              <h2>51, Block B, Jangpura B, New Delhi, Delhi 110014</h2>
              <p>Scroll through the map preview, then open the live route in Google Maps when you are ready to navigate.</p>
              <a href="https://maps.app.goo.gl/Ez8pNYKhYcpUrGLt5" target="_blank" rel="noreferrer">Open Google Maps</a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="final-booking" aria-label="Book J Residency">
        <Reveal>
          <div>
            <span className="section-kicker">Ready to stay?</span>
            <h2>Choose dates, compare rooms, and send your booking request.</h2>
            <a href="#reserve">Book Now</a>
          </div>
        </Reveal>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><Image src="/jresidency/j-logo.jpeg" alt="J Residency logo" width={118} height={118} /><p>J Residency by TriIndia Hospitality</p></div>
        <div className="footer-signup"><h2>Direct booking updates, room offers, and J Residency news.</h2><form><input type="email" placeholder="Email address" aria-label="Email address" /><button type="button">Notify me</button></form></div>
        <div className="footer-meta"><span>triindia.in/jresidency</span><span>Google Maps route ready</span></div>
      </footer>

      {selectedRoom && (
        <div className="room-modal" role="dialog" aria-modal="true" aria-label={`${selectedRoom.name} gallery`}>
          <button className="room-modal__backdrop" type="button" aria-label="Close gallery" onClick={() => setSelectedRoom(null)} />
          <div className="room-modal__panel">
            <button className="room-modal__close" type="button" onClick={() => setSelectedRoom(null)}>Close</button>
            <button className="modal-arrow modal-arrow--left" type="button" onClick={prevImage}>Prev</button>
            <button className="modal-arrow modal-arrow--right" type="button" onClick={nextImage}>Next</button>
            <div className="room-modal__image">
              <Image src={selectedImage || selectedRoom.heroImage} alt={`${selectedRoom.name} selected preview`} fill sizes="(max-width: 900px) 100vw, 70vw" style={{ objectFit: "contain" }} />
            </div>
            <div className="room-modal__content">
              <span>{selectedRoom.rate} per night</span>
              <h2>{selectedRoom.name}</h2>
              <p>{selectedRoom.tone}</p>
              <div className="room-modal__thumbs">
                {selectedRoom.images.map((src, index) => (
                  <button key={src} type="button" className={index === modalIndex ? "is-active" : ""} onClick={() => { setModalIndex(index); setSelectedImage(src); }}>
                    <Image src={src} alt={`${selectedRoom.name} thumbnail ${index + 1}`} width={110} height={78} />
                  </button>
                ))}
              </div>
              <button type="button" className="room-modal__book" onClick={() => { chooseRoom(selectedRoom.name); setSelectedRoom(null); }}>Book this room</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
