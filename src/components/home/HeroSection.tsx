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
    <>
      {/* ── Main hero ─────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 88px)" }}>
        {/* Full-bleed background */}
        <div className="absolute inset-0 bg-gradient-to-br from-vv-black via-gray-900 to-neutral-900" />

        {/* Fire/energy color overlay — orange only, no teal */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(ellipse at 25% 65%, #e8622a 0%, transparent 50%),
                              radial-gradient(ellipse at 78% 20%, #bf4f1e 0%, transparent 45%)`,
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
            ON FIRE FOR JESUS
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-heading font-black text-white uppercase leading-none"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)", letterSpacing: "-0.01em" }}
          >
            Faith You
            <br />
            <span style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
              Can Wear
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="font-body text-white/60 text-sm max-w-sm">
            Bold Christian apparel that helps people live on fire for God.
          </motion.p>

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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </section>

    </>
  );
}
