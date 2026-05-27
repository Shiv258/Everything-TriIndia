"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Landmark, Building2, MapPinned, Users } from "lucide-react";
import { getHomeStats, type HomeStat } from "@/lib/stats";

const iconFor: Record<HomeStat["icon"], React.ComponentType<{ className?: string }>> = {
  landmark: Landmark,
  buildings: Building2,
  "map-pinned": MapPinned,
  users: Users,
};

export default function AboutTriIndia() {
  const stats = getHomeStats();

  return (
    <section id="about" className="w-full overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-16 lg:grid-cols-[1.05fr,1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 block text-[11px] font-medium uppercase tracking-[0.36em] text-neutral-400"
            >
              About TriIndia
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.05] tracking-tight text-neutral-950"
            >
              We don&apos;t aggregate hotels. We run them.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-7 space-y-4 text-[15px] leading-relaxed text-neutral-500"
            >
              <p>
                TriIndia Hospitality is a Delhi-rooted operator. We hold the keys, hire the housekeepers, and answer the phone at the front desk. Our properties cluster around Nizamuddin Railway Station and Ashram Metro — the part of the city that quiets down at night without feeling far from anywhere.
              </p>
              <p>
                Book direct on this site and you skip the third-party markup. The rate you see is the rate we charge, and your messages reach the people who can actually do something about them.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-9"
            >
              <Link
                href="/hotels"
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-xl"
              >
                See the portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = iconFor[stat.icon];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-neutral-100 bg-neutral-50/60 p-7 transition-all hover:border-neutral-200 hover:bg-white hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)]"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-3xl font-medium tabular-nums leading-none tracking-tight text-neutral-950 md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2.5 text-[13px] leading-snug text-neutral-500">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
