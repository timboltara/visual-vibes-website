"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-vv-black py-16 px-5 sm:px-10 border-t border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-heading text-xs uppercase tracking-widest2 text-vv-orange mb-3">
          Join the Movement
        </p>
        <h2 className="font-heading font-black text-white uppercase leading-none mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          On Fire For Jesus
        </h2>
        <p className="font-body text-white/60 text-sm mb-8">
          Sign up and get{" "}
          <span className="font-semibold text-white">15% off your first order</span>{" "}
          with code <span className="font-semibold text-vv-orange">BLESSED26</span>. New drops, faith stories, and community updates — straight to your inbox.
        </p>

        {submitted ? (
          <div className="py-4">
            <p className="font-heading font-semibold uppercase tracking-widest text-vv-orange text-base">
              You&apos;re In ✝
            </p>
            <p className="font-body text-white/50 text-sm mt-1">
              Check your inbox for your welcome code.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/5 border border-white/20 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-vv-orange placeholder:text-white/30 transition-colors"
            />
            <button
              type="submit"
              className="bg-vv-orange text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-8 py-3 hover:bg-white hover:text-vv-black transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
