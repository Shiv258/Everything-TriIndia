"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Hotels", href: "/hotels" },
  { label: "Contact", href: "/#contact" },
];

function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const logoSize = size === "sm" ? 36 : 40;
  return (
    <div className="flex items-center gap-3">
      <div className="overflow-hidden rounded-lg ring-1 ring-neutral-200/60">
        <Image
          src="/triindia-logo.jpeg"
          alt="TriIndia Hospitality"
          width={logoSize}
          height={logoSize}
          className="block transition-transform duration-[600ms] ease-out hover:scale-105"
          priority
          style={{ width: logoSize, height: logoSize }}
        />
      </div>
      <div className="leading-tight">
        <div className="font-display text-[15px] tracking-tight text-neutral-950">
          TriIndia
        </div>
        <div className="text-[9px] uppercase tracking-[0.22em] text-neutral-500">
          Hospitality
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-neutral-100 bg-white/95 shadow-sm backdrop-blur-xl"
          : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="TriIndia Hospitality — Home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
            >
              <Link
                href={link.href}
                className="group relative px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-600 transition-colors hover:text-neutral-950"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-neutral-950 transition-all duration-300 group-hover:w-3/4" />
              </Link>
            </motion.div>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 text-neutral-700 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/15 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 210 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[300px] flex-col border-l border-neutral-100 bg-white shadow-xl sm:w-[380px]"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 p-6">
                <Wordmark size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-700 transition-all hover:bg-neutral-50 hover:text-neutral-950"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
