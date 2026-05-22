"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Building2, Star, Globe } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Happy Guests", delay: 0 },
  { icon: Building2, value: "200+", label: "Partner Hotels", delay: 0.1 },
  { icon: Star, value: "4.9", label: "Average Rating", delay: 0.2 },
  { icon: Globe, value: "15+", label: "Countries", delay: 0.3 },
];

export default function TrustSection() {
  return (
    <section id="about" className="w-full bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[11px] uppercase tracking-[3px] text-gray-400 font-medium mb-4 block"
            >
              About TRIINDIA
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              Discover Excellence in Hospitality. Trusted Hotels You Can Rely On
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-500 text-sm md:text-base leading-relaxed mb-8"
            >
              A versatile platform offering a wide range of hotel options and services. We curate the finest properties to ensure every guest experiences luxury, comfort, and memorable stays. From boutique gems to grand resorts, find your perfect match.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="#rooms">
                <button className="bg-black text-white text-sm font-medium px-6 py-5 rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-xl group flex items-center">
                  Explore Hotels
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: stat.delay }}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <div className="bg-gray-50 border-0 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 cursor-default group p-6 flex flex-col items-start">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors"
                    whileHover={{ rotate: 10 }}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-sm text-gray-500 mt-1">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
