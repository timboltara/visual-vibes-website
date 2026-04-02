"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Marcus T.",
    location: "Atlanta, GA",
    quote:
      "I wore the Faith Over Fear tee to work and my coworker asked me about it. Led to a 20-minute conversation about Jesus. This brand is literally a ministry.",
    stars: 5,
  },
  {
    name: "Destiny R.",
    location: "Houston, TX",
    quote:
      "The Oversized Grace Sweater is everything. Soft, beautiful, and every time I wear it someone asks where I got it. Love that it opens doors to share my faith.",
    stars: 5,
  },
  {
    name: "Jordan K.",
    location: "Chicago, IL",
    quote:
      "Bought the Vintage Grace Hoodie and it exceeded every expectation. Premium quality, meaningful design. Visual Vibes is the real deal — bold faith, clean drip.",
    stars: 5,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 mb-4">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-vv-orange text-sm">★</span>
    ))}
  </div>
);

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-vv-gray py-16 px-5 sm:px-10" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black">
            What People Are Saying
          </h2>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-vv-orange text-sm">★</span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-7"
            >
              <Stars count={t.stars} />
              <p className="font-body text-sm text-vv-black leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-vv-gray pt-4">
                <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">
                  {t.name}
                </p>
                <p className="font-body text-xs text-vv-gray-mid mt-0.5">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
