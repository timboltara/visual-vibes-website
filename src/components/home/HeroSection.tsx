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

      {/* ── Brand video placeholder ────────────────────────────
          When the client has a video ready, replace the placeholder
          below with an actual <iframe> or <video> element.
          Example iframe (YouTube):
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1"
              allow="autoplay; fullscreen"
              className="w-full h-full object-cover"
            />
      ─────────────────────────────────────────────────────── */}
      <section className="bg-vv-black relative overflow-hidden" style={{ height: "480px" }}>
        {/* Placeholder — swap this div for the iframe when video is ready */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-6">
          <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mb-2">
            <div className="w-0 h-0 border-y-[14px] border-y-transparent border-l-[24px] border-l-white/60 ml-1.5" />
          </div>
          <p className="font-heading text-[10px] uppercase tracking-widest2 text-vv-orange">
            Brand Video Coming Soon
          </p>
          <p
            className="font-heading font-black text-white uppercase leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            Visual Vibes is More
            <br />
            Than Clothing
          </p>
          <p className="font-body text-white/50 text-sm max-w-md">
            Visual Vibes is a movement to represent Christ boldly in everyday life. We create designs that challenge believers, spark conversations, and remind people to live on fire for God — not lukewarm.
          </p>
        </div>
        {/* Subtle orange glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, #e8622a 0%, transparent 65%)" }}
        />
      </section>
    </>
  );
}
