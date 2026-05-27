"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getActiveHotels } from "@/lib/hotels";
import { TRIINDIA_FOUNDED_YEAR, CURRENT_YEAR } from "@/lib/stats";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Hotels", href: "/hotels" },
  { label: "Contact", href: "/#contact" },
];

const portfolioHotels = getActiveHotels();

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    facebook: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    whatsapp: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-neutral-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Link href="/" className="mb-6 inline-flex items-center gap-3">
              <div className="overflow-hidden rounded-lg ring-1 ring-white/15">
                <Image
                  src="/triindia-logo.jpeg"
                  alt="TriIndia Hospitality"
                  width={42}
                  height={42}
                  className="block"
                />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base tracking-tight">TriIndia</div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-white/50">
                  Hospitality
                </div>
              </div>
            </Link>
            <p className="mb-7 max-w-sm text-sm leading-relaxed text-white/55">
              Operating and growing a portfolio of hotels across central Delhi since {TRIINDIA_FOUNDED_YEAR}. Local roots. Direct stays. No middlemen.
            </p>
            <div className="flex items-center gap-3">
              {["instagram", "facebook", "whatsapp"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  aria-label={social}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-neutral-950"
                >
                  <SocialIcon name={social} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="mb-6 text-[11px] uppercase tracking-[0.28em] text-white/55">
              Navigate
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.label} whileHover={{ x: 4 }}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="mb-6 text-[11px] uppercase tracking-[0.28em] text-white/55">
              Portfolio
            </h4>
            <ul className="space-y-3">
              {portfolioHotels.map((hotel) => (
                <motion.li key={hotel.slug} whileHover={{ x: 4 }}>
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="text-sm text-white/65 transition-colors duration-300 hover:text-white"
                  >
                    {hotel.shortName ?? hotel.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="mb-6 text-[11px] uppercase tracking-[0.28em] text-white/55">
              Stay in touch
            </h4>
            <p className="mb-4 text-sm text-white/55">
              Quiet updates when a new property opens or a seasonal rate changes.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                aria-label="Subscribe"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-white text-neutral-950 transition-all duration-300 hover:bg-white/90"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        <div className="mb-8 h-px bg-white/10" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <p className="text-xs text-white/40">
            © {CURRENT_YEAR} TriIndia Hospitality. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-white/40 transition-colors duration-300 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
