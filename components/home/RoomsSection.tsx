"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const rooms = [
  {
    id: 1,
    name: "Ashram View Hotel",
    location: "Rishikesh, India",
    price: "3,500",
    rating: 4.8,
    images: [
      "/ashram/WhatsApp%20Image%202026-05-12%20at%2012.54.56%20PM%20(1).jpeg",
      "/ashram/WhatsApp%20Image%202026-05-12%20at%2012.54.57%20PM%20(1).jpeg",
      "/ashram/WhatsApp%20Image%202026-05-12%20at%2012.54.58%20PM%20(3).jpeg",
    ],
    href: "#",
  },
  {
    id: 2,
    name: "J Residency Hotel",
    location: "Delhi, India",
    price: "4,200",
    rating: 4.9,
    images: [
      "/j-residency-main/WhatsApp%20Image%202026-05-17%20at%206.46.48%20PM%20(1).jpeg",
      "/j-residency-main/WhatsApp%20Image%202026-05-17%20at%206.46.48%20PM.jpeg",
      "/j-residency-main/WhatsApp%20Image%202026-05-17%20at%206.46.49%20PM%20(1).jpeg",
    ],
    href: "/jresidency",
  },
  {
    id: 3,
    name: "Preet Palace",
    location: "Amritsar, India",
    price: "2,800",
    rating: 4.7,
    images: [
      "/preet/WhatsApp%20Image%202026-05-12%20at%2012.51.33%20PM%20(2).jpeg",
      "/preet/WhatsApp%20Image%202026-05-12%20at%2012.51.34%20PM.jpeg",
      "/preet/WhatsApp%20Image%202026-05-12%20at%2012.51.35%20PM%20(2).jpeg",
    ],
    href: "#",
  },
  {
    id: 4,
    name: "Samrat Residency",
    location: "Jaipur, India",
    price: "3,900",
    rating: 4.8,
    images: [
      "/samrth/WhatsApp%20Image%202026-05-12%20at%2012.53.10%20PM%20(2).jpeg",
      "/samrth/WhatsApp%20Image%202026-05-12%20at%2012.53.11%20PM%20(1).jpeg",
      "/samrth/WhatsApp%20Image%202026-05-12%20at%2012.53.15%20PM%20(1).jpeg",
    ],
    href: "#",
  },
];

export default function RoomsSection() {
  const [likedRooms, setLikedRooms] = useState<number[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0,
  });

  const toggleLike = (id: number) => {
    setLikedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const prevImage = (roomId: number, total: number) => {
    setImageIndices((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] - 1 + total) % total,
    }));
  };

  const nextImage = (roomId: number, total: number) => {
    setImageIndices((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % total,
    }));
  };

  return (
    <section id="rooms" className="w-full bg-gray-50 py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] uppercase tracking-[3px] text-gray-400 font-medium mb-4 block">
              Featured Stays
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Explore Stays, About Comfort.<br />
              Your Stay, Our Priority
            </h2>
          </motion.div>
        </div>

        {/* Room Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:shadow-black/5 transition-all duration-300 cursor-default hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Image Carousel */}
                    <div className="w-full h-full relative">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={imageIndices[room.id]}
                          src={room.images[imageIndices[room.id]]}
                          alt={room.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[600ms] ease-out"
                        />
                      </AnimatePresence>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* Left Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        prevImage(room.id, room.images.length);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-800" />
                    </button>

                    {/* Right Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        nextImage(room.id, room.images.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-800" />
                    </button>

                    {/* Image Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {room.images.map((_, i) => (
                        <span
                          key={i}
                          className={`block h-1.5 rounded-full transition-all duration-300 ${
                            i === imageIndices[room.id]
                              ? "bg-white w-4"
                              : "bg-white/50 w-1.5"
                          }`}
                        />
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleLike(room.id);
                      }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 ${
                        likedRooms.includes(room.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-gray-600 hover:bg-white"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedRooms.includes(room.id) ? "fill-current" : ""}`}
                      />
                    </motion.button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-700">{room.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 mb-4 group-hover:text-gray-500 transition-colors duration-300">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs group-hover:translate-x-0.5 transition-transform duration-300">{room.location}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="group-hover:translate-x-0.5 transition-transform duration-300">
                        <span className="text-lg font-bold text-gray-900">₹{room.price}</span>
                        <span className="text-xs text-gray-400"> / night</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href={room.href} onClick={(e) => { if (room.href === "#") e.preventDefault(); }}>
                          <button className="bg-black text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
                            Book Now
                          </button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
