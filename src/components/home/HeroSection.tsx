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

      {/* Content — top / center / bottom */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center justify-between h-full px-6 py-10 sm:py-14 text-center"
      >
        {/* ── Top: eyebrow ─────────────────────── */}
        <motion.p
          variants={fadeUp}
          className="font-heading text-vv-orange text-xs tracking-widest3 uppercase"
        >
          On Fire For Jesus
        </motion.p>

        {/* ── Center: heading + tagline ─────────── */}
        <div className="flex flex-col items-center gap-5">
          {/*
           * The heading is split into two lines:
           *  Line 1 "Faith You"  — solid white HTML text
           *  Line 2 "Can Wear"   — SVG <text fill="none" stroke="white">
           *
           * Using SVG for line 2 gives a true hollow-outline effect:
           * fill="none" means the letter interiors are fully transparent,
           * so 'A', 'E', 'W' etc. have open counters with no overlapping
           * strokes — impossible to achieve cleanly with -webkit-text-stroke.
           */}
          <motion.div
            variants={fadeUp}
            className="font-heading font-black uppercase leading-tight text-center"
            style={{ fontSize: "clamp(3.2rem, 10vw, 9rem)", letterSpacing: "-0.01em" }}
            role="heading"
            aria-level={1}
          >
            {/* Line 1 */}
            <span className="block text-white">Faith You</span>

            {/* Screen-reader text for line 2 */}
            <span className="sr-only">Can Wear</span>

            {/* Line 2 — SVG outlined text */}
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: "block",
                width: "100%",
                height: "1em",
                overflow: "visible",
                marginTop: "0.05em",
              }}
            >
              <text
                x="50%"
                y="0.82em"
                textAnchor="middle"
                fill="none"
                stroke="white"
                strokeWidth="2"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900,
                  fontSize: "1em",
                  letterSpacing: "-0.01em",
                }}
              >
                CAN WEAR
              </text>
            </svg>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-body text-white/60 text-sm max-w-xs sm:max-w-sm"
          >
            Bold Christian Apparel That Helps People Live On Fire For God.
          </motion.p>
        </div>

        {/* ── Bottom: CTAs ─────────────────────── */}
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
