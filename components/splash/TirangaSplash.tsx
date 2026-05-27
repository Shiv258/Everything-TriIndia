"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export default function TirangaSplash({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const total = reduce ? 800 : 2600;

  useEffect(() => {
    const id = window.setTimeout(onComplete, total);
    return () => window.clearTimeout(id);
  }, [total, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#0a1226]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
    >
      <motion.div
        aria-hidden
        className="absolute h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(195,154,87,0.28) 0%, rgba(195,154,87,0.08) 38%, transparent 72%)",
        }}
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute h-[260px] w-[260px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,153,51,0.22) 0%, rgba(255,153,51,0.06) 45%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.85, 0.55, 0.85], scale: [0.85, 1.18, 1, 1.18] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          border: "1px solid rgba(195,154,87,0.4)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.55, 0], scale: [0.6, 1.7, 2.2] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -m-4 rounded-3xl bg-white/5 blur-2xl" aria-hidden />
          <Image
            src="/triindia-logo.jpeg"
            alt="TriIndia Hospitality"
            width={240}
            height={240}
            className="relative rounded-2xl shadow-[0_40px_120px_-30px_rgba(195,154,87,0.55)]"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: "easeOut" }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#c39a57] to-transparent" aria-hidden />
          <p className="text-[10px] uppercase tracking-[0.42em] text-white/55">
            A house of hotels in Delhi
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
