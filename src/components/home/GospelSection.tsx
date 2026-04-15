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
            The Mission
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
              Visual Vibes exists to spread the Gospel by creating bold apparel that inspires people to live on fire for God.
            </p>
            <p>
              Faith is not passive. It&apos;s bold. It&apos;s alive. It&apos;s on fire. Every piece we create is designed to spark a conversation — and open a door to the Gospel.
            </p>
            <p>
              Clothing is the entry point — but the goal is impact.
            </p>
          </div>

          {/* Brand pillars */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            {[
              { label: "Bold Faith", desc: "Strong, unapologetic messages. Not watered-down." },
              { label: "Real Life Christianity", desc: "Faith outside of church — at work, the gym, in public." },
              { label: "Energy / Fire", desc: "Passion. Urgency. Excitement for God." },
            ].map((p) => (
              <div key={p.label} className="flex gap-4 items-start">
                <span className="w-1 h-1 rounded-full bg-vv-orange mt-2 flex-shrink-0" />
                <div>
                  <p className="font-heading text-xs uppercase tracking-widest text-vv-orange font-semibold">{p.label}</p>
                  <p className="font-body text-sm text-gray-500 mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-vv-orange pl-5">
            <p className="font-body text-base text-white/80 italic leading-relaxed">
              &ldquo;For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.&rdquo;
            </p>
            <cite className="font-heading text-vv-orange text-xs uppercase tracking-widest not-italic mt-2 block">
              Romans 1:16
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
              <p className="font-heading font-semibold uppercase tracking-widest text-vv-orange text-lg">
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
                className="w-full bg-transparent border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-orange placeholder:text-gray-600 transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-orange placeholder:text-gray-600 transition-colors"
              />
              <textarea
                required
                rows={4}
                placeholder="Your prayer request..."
                value={formState.prayer}
                onChange={(e) => setFormState({ ...formState, prayer: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-orange placeholder:text-gray-600 resize-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-vv-orange text-white font-heading text-xs font-semibold uppercase tracking-widest2 py-4 hover:bg-white hover:text-vv-black transition-colors duration-300 mt-1"
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
