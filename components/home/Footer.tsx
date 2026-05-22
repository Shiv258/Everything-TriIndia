"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Image from "next/image";

const quickLinks = ["Home", "About Us", "Services", "Facilities", "Membership", "Contact"];
const services = ["Hotel Booking", "Room Service", "Event Planning", "Concierge", "Airport Transfer", "Spa & Wellness"];

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    twitter: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
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
    linkedin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
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
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/triindia-logo.jpeg"
                  alt="TRIINDIA"
                  width={128}
                  height={32}
                  className="h-8 w-auto object-contain rounded-md hover:scale-105 transition-transform duration-[600ms] ease-out"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted partner for discovering and booking India&apos;s finest hotels. Comfort, luxury, and unforgettable experiences.
            </p>
            <div className="flex items-center gap-3">
              {["twitter", "instagram", "facebook", "linkedin"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <SocialIcon name={social} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="text-sm font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link} whileHover={{ x: 5 }} className="transition-transform">
                  <a href="#" className="text-[11px] uppercase tracking-[3px] text-gray-400 hover:text-white transition-colors duration-300">
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="text-sm font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((link) => (
                <motion.li key={link} whileHover={{ x: 5 }} className="transition-transform">
                  <a href="#" className="text-[11px] uppercase tracking-[3px] text-gray-400 hover:text-white transition-colors duration-300">
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="text-sm font-semibold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for exclusive deals and travel inspiration.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gray-500 focus:ring-0 outline-none"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="bg-white text-black text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center h-[42px] w-[42px]">
                  <Send className="w-4 h-4" />
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        <div className="h-px bg-gray-800 mb-8" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-gray-500">
            © 2026 TRIINDIA Hotels. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors duration-300"
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
