"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TRIINDIA_FOUNDED_YEAR } from "@/lib/stats";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.25 + i * 0.12, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[760px] w-full items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/55 to-black/75" />

      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-28 text-center text-white">
        <motion.span
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-7 text-[11px] uppercase tracking-[0.42em] text-white/65"
        >
          Hospitality since {TRIINDIA_FOUNDED_YEAR}
        </motion.span>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display text-[clamp(2.6rem,6vw,5.25rem)] leading-[1.02] tracking-tight"
        >
          A house of hotels
          <br />
          in Delhi.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
        >
          TriIndia Hospitality runs 15+ properties across the capital. Local roots. Direct stays. No middlemen.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/hotels"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Explore our hotels
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/55 hover:bg-white/10"
          >
            Our story
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/70 hover:text-white"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <motion.span
          className="inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.36em]"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
