"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const beliefs = [
  {
    title: "The Gospel",
    body: "We believe Jesus Christ died for our sins, rose on the third day, and offers eternal life to all who believe. This is the message behind every piece we create.",
  },
  {
    title: "Our Mission",
    body: "To create apparel that sparks conversations about faith. We want our customers to be bold ambassadors of the Gospel in their everyday lives.",
  },
  {
    title: "Our Community",
    body: "We stand with believers everywhere — praying with our customers and building a community rooted in love.",
  },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const [formState, setFormState] = useState({ name: "", email: "", prayer: "" });
  const [submitted, setSubmitted] = useState(false);
  const beliefsRef = useRef(null);
  const beliefsInView = useInView(beliefsRef, { once: true, margin: "-60px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-[129px] bg-white">
      {/* Hero */}
      <div className="relative bg-vv-black overflow-hidden" style={{ minHeight: "60vh" }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(ellipse at 50% 50%, #1A6B6B 0%, transparent 70%)` }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 min-h-[60vh]"
        >
          <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-4">Visual Vibes</p>
          <h1
            className="font-heading font-black text-white uppercase leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            Our Story
          </h1>
          <p className="font-body text-gray-400 text-base max-w-md mx-auto mt-6">
            A brand born from faith, built to glorify God one garment at a time.
          </p>
        </motion.div>
      </div>

      {/* Brand story */}
      <section className="max-w-3xl mx-auto px-5 sm:px-10 py-20">
        <FadeUp>
          <div className="space-y-5 font-body text-lg text-vv-black leading-relaxed">
            <p>
              Visual Vibes started as a simple idea: what if a piece of clothing could open
              a door to talk about Jesus? What if your hoodie could spark a conversation that
              changes someone&apos;s life?
            </p>
            <p>
              We launched with a small batch of tees and a big faith. Today, we&apos;re a
              growing community of believers who refuse to keep their faith hidden. We wear
              it boldly — on our chest, on our back, on our sleeves.
            </p>
            <p>
              Every collection we release is prayed over. Every design is intentional.
              Visual Vibes is not just a clothing brand — it&apos;s a ministry in fabric form.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <blockquote className="mt-12 border-l-2 border-vv-teal pl-6 py-1">
            <p className="font-body text-lg italic text-vv-black leading-relaxed">
              &ldquo;For I am not ashamed of the gospel, because it is the power of God
              that brings salvation to everyone who believes.&rdquo;
            </p>
            <cite className="font-heading text-vv-orange text-xs uppercase tracking-widest not-italic mt-2 block">
              Romans 1:16
            </cite>
          </blockquote>
        </FadeUp>
      </section>

      {/* What We Believe */}
      <section className="bg-vv-gray py-20 px-5 sm:px-10" ref={beliefsRef}>
        <div className="max-w-screen-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={beliefsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black mb-10"
          >
            What We Believe
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beliefs.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                animate={beliefsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white p-8"
              >
                <h3 className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black mb-4">
                  {b.title}
                </h3>
                <p className="font-body text-sm text-vv-gray-mid leading-relaxed">{b.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture banner */}
      <section className="bg-vv-teal text-white py-24 px-6 text-center">
        <FadeUp>
          <p
            className="font-heading font-black uppercase leading-none text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            &ldquo;I can do all things through Christ who strengthens me.&rdquo;
          </p>
          <p className="font-heading text-xs uppercase tracking-widest2 text-white/60 mt-4">
            Philippians 4:13
          </p>
          <Link
            href="/shop"
            className="inline-block mt-10 bg-white text-vv-black font-heading text-xs font-semibold uppercase tracking-widest2 px-10 py-4 hover:bg-vv-black hover:text-white transition-colors duration-300"
          >
            Shop Now
          </Link>
        </FadeUp>
      </section>

      {/* Prayer form */}
      <section className="bg-vv-black py-20 px-5 sm:px-10" id="prayer">
        <div className="max-w-lg mx-auto">
          <FadeUp>
            <p className="font-heading text-xs uppercase tracking-widest2 text-gray-500 mb-3">Prayer Request</p>
            <h2 className="font-heading font-semibold text-lg uppercase tracking-widest text-white mb-8">
              Submit a Prayer
            </h2>

            {submitted ? (
              <div className="text-center py-10">
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
                  rows={5}
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
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
