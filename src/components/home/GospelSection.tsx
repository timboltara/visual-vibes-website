"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function GospelSection() {
  const [formState, setFormState] = useState({ name: "", email: "", prayer: "" });
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-vv-black text-white" id="gospel" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Faith Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-5">
            The Gospel
          </p>
          <h2
            className="font-heading font-black text-white uppercase leading-none mb-8"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            More Than
            <br />
            Clothing.
          </h2>

          <div className="space-y-4 font-body text-gray-400 text-base leading-relaxed">
            <p>
              Visual Vibes was founded on the belief that clothing can be a conversation
              starter for the Gospel. Every piece we create is designed to spark a
              question — and open a door.
            </p>
            <p>
              We believe in Jesus Christ as the only path to salvation. When you wear
              Visual Vibes, you&apos;re not just wearing a brand. You&apos;re wearing a mission.
            </p>
          </div>

          <blockquote className="mt-8 border-l-2 border-vv-teal pl-5">
            <p className="font-body text-base text-white/80 italic leading-relaxed">
              &ldquo;For God so loved the world that he gave his one and only Son, that
              whoever believes in him shall not perish but have eternal life.&rdquo;
            </p>
            <cite className="font-heading text-vv-orange text-xs uppercase tracking-widest not-italic mt-2 block">
              John 3:16
            </cite>
          </blockquote>
        </motion.div>

        {/* Right: Prayer form */}
        <motion.div
          id="prayer"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <p className="font-heading text-xs uppercase tracking-widest2 text-gray-400 mb-5">
            Prayer Request
          </p>
          <h3 className="font-heading font-semibold text-lg uppercase tracking-widest text-white mb-6">
            We&apos;d Love to Pray With You
          </h3>

          {submitted ? (
            <div className="py-10 text-center">
              <p className="font-heading font-semibold uppercase tracking-widest text-vv-teal text-lg">
                Prayer Submitted ✝
              </p>
              <p className="font-body text-gray-400 text-sm mt-2">
                We are believing with you. God hears every prayer.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-teal placeholder:text-gray-600 transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-teal placeholder:text-gray-600 transition-colors"
              />
              <textarea
                required
                rows={4}
                placeholder="Your prayer request..."
                value={formState.prayer}
                onChange={(e) => setFormState({ ...formState, prayer: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-teal placeholder:text-gray-600 resize-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-white text-vv-black font-heading text-xs font-semibold uppercase tracking-widest2 py-4 hover:bg-vv-teal hover:text-white transition-colors duration-300 mt-1"
              >
                Submit Prayer Request
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
