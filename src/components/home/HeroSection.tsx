"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 88px)" }}>
      {/* Full-bleed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-vv-black via-gray-900 to-slate-800" />

      {/* Subtle color overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(ellipse at 30% 60%, #1A6B6B 0%, transparent 55%),
                            radial-gradient(ellipse at 80% 20%, #E8622A 0%, transparent 45%)`,
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-6 px-6 text-center"
      >
        <motion.p variants={fadeUp} className="font-heading text-vv-orange text-xs tracking-widest3 uppercase">
          New Arrivals — Shop Now
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-heading font-black text-white uppercase leading-none"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)", letterSpacing: "-0.01em" }}
        >
          Wear Your
          <br />
          <span style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
            Faith
          </span>
        </motion.h1>

        <motion.div variants={fadeUp}>
          <Link
            href="/shop"
            className="inline-block bg-white text-vv-black font-heading text-xs font-semibold uppercase tracking-widest2 px-10 py-4 hover:bg-vv-black hover:text-white transition-colors duration-300"
          >
            Shop Now
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </section>
  );
}
