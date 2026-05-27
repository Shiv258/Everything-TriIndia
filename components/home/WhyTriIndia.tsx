"use client";

import { motion } from "framer-motion";
import { TRIINDIA_FOUNDED_YEAR } from "@/lib/stats";

const values = [
  {
    number: "01",
    title: "Operator, not aggregator.",
    body: "We hold the keys. Reception, housekeeping, dining — staffed by us. The person on the phone is the person who can change your room, not someone reading from a script three time zones away.",
  },
  {
    number: "02",
    title: `Delhi-rooted, since ${TRIINDIA_FOUNDED_YEAR}.`,
    body: "We grew up in this city. We know which neighbourhoods quiet down at night, which restaurants stay open late, and which rickshaw stand is honest at 2 a.m. That goes into every recommendation.",
  },
  {
    number: "03",
    title: "Direct stays. Fair pricing.",
    body: "Book direct on this site and you skip the third-party markup. The rate you see is the rate we charge. No surprise fees, no platform commission padding.",
  },
];

export default function WhyTriIndia() {
  return (
    <section className="w-full bg-neutral-950 py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-5 block text-[11px] uppercase tracking-[0.36em] text-white/55">
            Why TriIndia
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-tight">
            Three things we hold to, every stay.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {values.map((value, i) => (
            <motion.div
              key={value.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group flex flex-col gap-6 bg-neutral-950 p-10 transition-colors hover:bg-neutral-900"
            >
              <div className="font-display text-5xl font-light tabular-nums text-white/40 transition-colors group-hover:text-[#c39a57] md:text-6xl">
                {value.number}
              </div>
              <h3 className="font-display text-2xl leading-tight tracking-tight">
                {value.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-white/60">
                {value.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
