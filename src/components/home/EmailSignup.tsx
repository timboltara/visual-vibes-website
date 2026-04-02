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
    <section className="bg-vv-teal py-16 px-5 sm:px-10">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-heading text-xs uppercase tracking-widest2 text-white/60 mb-3">
          Join the Family
        </p>
        <h2 className="font-heading font-black text-white uppercase leading-none mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Join the Movement
        </h2>
        <p className="font-body text-white/80 text-sm mb-8">
          Sign up and get{" "}
          <span className="font-semibold text-white">15% off your first order</span>{" "}
          with code <span className="font-semibold text-white">BLESSED26</span>. New drops, faith stories, and community updates — straight to your inbox.
        </p>

        {submitted ? (
          <div className="py-4">
            <p className="font-heading font-semibold uppercase tracking-widest text-white text-base">
              You&apos;re In ✝
            </p>
            <p className="font-body text-white/70 text-sm mt-1">
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
              className="flex-1 bg-white/10 border border-white/30 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-white placeholder:text-white/40 transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-vv-teal font-heading text-xs font-semibold uppercase tracking-widest2 px-8 py-3 hover:bg-vv-black hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
