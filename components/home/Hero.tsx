"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, CalendarDays, ArrowRight, Minus, Plus } from "lucide-react";
import { Calendar } from "./Calendar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

function formatDate(date: Date | null) {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Hero() {
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [openCalendar, setOpenCalendar] = useState<"checkin" | "checkout" | null>(null);
  const [location, setLocation] = useState("delhi");

  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        checkInRef.current &&
        !checkInRef.current.contains(target) &&
        checkOutRef.current &&
        !checkOutRef.current.contains(target)
      ) {
        setOpenCalendar(null);
      }
    }
    if (openCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCalendar]);

  const handleCheckInSelect = (date: Date) => {
    setCheckIn(date);
    if (checkOut && date >= checkOut) {
      setCheckOut(null);
    }
    setOpenCalendar("checkout");
  };

  const handleCheckOutSelect = (date: Date) => {
    setCheckOut(date);
    setOpenCalendar(null);
  };

  const today = new Date();

  return (
    <section id="book" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white pt-16">
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
        >
          Discover Top Hotels, Compare Deals, and Book Your Perfect Stay
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-sm md:text-base text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Search trusted hotels for unforgettable stays at unbeatable prices. Find the best hotels near you in seconds with ease and confidence.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-0 shadow-2xl mx-auto w-fit"
        >
          {/* Location */}
          <div className="w-36 flex flex-col justify-center gap-1 text-left bg-white/10 rounded-2xl px-4 py-3 h-[68px] hover:bg-white/20 transition-colors md:mx-1 cursor-pointer">
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm font-medium text-white border-0 p-0 h-auto shadow-none focus:ring-0 w-full outline-none cursor-pointer appearance-none"
              style={{ backgroundImage: "none" }}
            >
              <option value="dubai" className="text-gray-900">Dubai</option>
              <option value="delhi" className="text-gray-900">Delhi</option>
              <option value="mumbai" className="text-gray-900">Mumbai</option>
              <option value="jaipur" className="text-gray-900">Jaipur</option>
              <option value="goa" className="text-gray-900">Goa</option>
            </select>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/20" />

          {/* Guests */}
          <div className="w-36 flex flex-col justify-center gap-1 text-left bg-white/10 rounded-2xl px-4 py-3 h-[68px] hover:bg-white/20 transition-colors md:mx-1">
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium flex items-center gap-1">
              <Users className="w-3 h-3" /> Guests
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 transition-colors text-white"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-semibold text-white min-w-[1.5rem] text-center tabular-nums">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(8, guests + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 transition-colors text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/20" />

          {/* Check-in */}
          <div
            ref={checkInRef}
            className="w-36 flex flex-col justify-center gap-1 text-left bg-white/10 rounded-2xl px-4 py-3 h-[68px] hover:bg-white/20 transition-colors md:mx-1 relative cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Check-in
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenCalendar(openCalendar === "checkin" ? null : "checkin");
              }}
              className="text-left text-sm font-medium text-white bg-transparent border-0 p-0 h-auto focus:outline-none w-full"
            >
              {checkIn ? formatDate(checkIn) : "Select date"}
            </button>
            {openCalendar === "checkin" && (
              <div className="absolute top-full left-0 mt-2 z-50" onClick={(e) => e.stopPropagation()}>
                <Calendar
                  value={checkIn ?? undefined}
                  onSelect={handleCheckInSelect}
                  minDate={today}
                />
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-white/20" />

          {/* Check-out */}
          <div
            ref={checkOutRef}
            className="w-36 flex flex-col justify-center gap-1 text-left bg-white/10 rounded-2xl px-4 py-3 h-[68px] hover:bg-white/20 transition-colors md:mx-1 relative cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Check-out
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenCalendar(openCalendar === "checkout" ? null : "checkout");
              }}
              className="text-left text-sm font-medium text-white bg-transparent border-0 p-0 h-auto focus:outline-none w-full"
            >
              {checkOut ? formatDate(checkOut) : "Select date"}
            </button>
            {openCalendar === "checkout" && (
              <div className="absolute top-full left-0 mt-2 z-50" onClick={(e) => e.stopPropagation()}>
                <Calendar
                  value={checkOut ?? undefined}
                  onSelect={handleCheckOutSelect}
                  minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : today}
                />
              </div>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:ml-2"
          >
            <button className="bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-xl flex items-center justify-center h-[68px] w-[68px] p-0">
              <Search className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>

        <motion.a
          href="#about"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-white/80 hover:text-white transition-all group"
        >
          Let&apos;s know us
          <motion.span
            className="inline-block"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
