"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col h-[calc(100vh-88px)] md:h-[calc(100vh-129px)]"
      style={{ minHeight: "500px" }}
    >
      {/* Full-bleed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-vv-black via-gray-900 to-neutral-900" />

      {/* Fire/energy color overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(ellipse at 25% 65%, #e8622a 0%, transparent 50%),
                            radial-gradient(ellipse at 78% 20%, #bf4f1e 0%, transparent 45%)`,
        }}
      />

      {/* Content — spread top / center / bottom so buttons are always visible */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center justify-between h-full px-6 py-10 sm:py-14 text-center"
      >
        {/* ── Top: eyebrow ────────────────────────── */}
        <motion.p
          variants={fadeUp}
          className="font-heading text-vv-orange text-xs tracking-widest3 uppercase"
        >
          On Fire For Jesus
        </motion.p>

        {/* ── Center: heading + tagline ────────────── */}
        <div className="flex flex-col items-center gap-5">
          <motion.h1
            variants={fadeUp}
            className="font-heading font-black text-white uppercase leading-tight"
            style={{ fontSize: "clamp(3.2rem, 10vw, 9rem)", letterSpacing: "-0.01em" }}
          >
            Faith You
            <br />
            <span
              className="font-heading font-black uppercase"
              style={{
                WebkitTextStroke: "2px white",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                fontSize: "inherit",
                letterSpacing: "inherit",
              }}
            >
              Can Wear
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-white/60 text-sm max-w-xs sm:max-w-sm"
          >
            Bold Christian Apparel That Helps People Live On Fire For God.
          </motion.p>
        </div>

        {/* ── Bottom: CTAs ────────────────────────── */}
        <motion.div variants={fadeUp} className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/shop"
            className="inline-block bg-vv-orange text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-10 py-4 hover:bg-white hover:text-vv-black transition-colors duration-300"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="inline-block border border-white/40 text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-10 py-4 hover:bg-white hover:text-vv-black transition-colors duration-300"
          >
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </section>
  );
}
