"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";
const DISCOUNT_RATE = 0.15;
const FREE_SHIPPING_THRESHOLD = 75;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
  });

  const discount = subtotal * DISCOUNT_RATE;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
  const total = afterDiscount + shipping;

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (submitted) {
    return (
      <div className="pt-[129px] min-h-screen bg-white flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-vv-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">✓</span>
          </div>
          <p className="font-heading text-[10px] uppercase tracking-widest2 text-vv-gray-mid mb-2">
            Order Confirmed
          </p>
          <h1 className="font-heading font-black text-3xl uppercase text-vv-black mb-4">
            Thank you, {form.firstName || "friend"}!
          </h1>
          <p className="font-body text-sm text-vv-gray-mid leading-relaxed mb-8">
            Your order is on its way. You&apos;ll receive a confirmation email shortly. Wear your faith boldly.
          </p>
          <Link
            href="/shop"
            className="inline-block font-heading text-xs font-bold uppercase tracking-widest2 px-10 py-4 bg-vv-black text-white hover:bg-vv-teal transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[129px] min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 lg:gap-16 items-start">

        {/* ── Left: Form ──────────────────────────────────── */}
        <div className="order-2 lg:order-1 py-6 lg:py-0">

          {/* Store name + breadcrumb */}
          <div className="mb-8">
            <Link href="/" className="font-heading font-bold text-xl uppercase tracking-widest2 text-vv-black hover:text-vv-teal transition-colors">
              Visual Vibes
            </Link>
            <div className="flex items-center gap-2 mt-3 font-heading text-[10px] uppercase tracking-widest">
              <Link href="/shop" className="text-vv-gray-mid hover:text-vv-black transition-colors">Cart</Link>
              <span className="text-gray-300">›</span>
              <span className="text-vv-black font-semibold">Information</span>
              <span className="text-gray-300">›</span>
              <span className="text-vv-gray-mid">Shipping</span>
              <span className="text-gray-300">›</span>
              <span className="text-vv-gray-mid">Payment</span>
            </div>
          </div>

          {/* Discount notice */}
          <div className="bg-vv-gray px-4 py-3 mb-6 flex items-center justify-between">
            <div>
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black">
                Promo <span className="text-vv-orange font-bold">BLESSED26</span> applied
              </p>
              <p className="font-body text-xs text-vv-gray-mid mt-0.5">15% off your order</p>
            </div>
            <span className="font-heading text-xs text-vv-teal font-bold">−${discount.toFixed(2)}</span>
          </div>

          {/* Contact */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-vv-black">Contact</h2>
              <span className="font-body text-xs text-vv-gray-mid">
                Have an account?{" "}
                <button className="underline hover:text-vv-black transition-colors">Log in</button>
              </span>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={set("email")}
              className="w-full border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors"
            />
            <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-vv-teal w-3.5 h-3.5" />
              <span className="font-body text-xs text-vv-gray-mid">Email me with news and offers</span>
            </label>
          </section>

          {/* Delivery */}
          <section className="mb-8">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-vv-black mb-3">Delivery</h2>
            <div className="flex flex-col gap-3">
              {/* Country */}
              <div className="border border-gray-300 px-4 py-3 bg-vv-gray/40">
                <label className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid block mb-0.5">Country / Region</label>
                <p className="font-body text-sm text-vv-black">United States</p>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                  className="border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                  className="border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors"
                />
              </div>

              {/* Address */}
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={set("address")}
                className="border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors"
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={form.apt}
                onChange={set("apt")}
                className="border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors"
              />

              {/* City / State / ZIP */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={set("city")}
                  className="border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors"
                />
                <select
                  value={form.state}
                  onChange={set("state")}
                  className="border border-gray-300 px-3 py-3 font-body text-sm text-vv-black focus:outline-none focus:border-vv-black transition-colors bg-white w-20"
                >
                  <option value="">State</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="ZIP"
                  value={form.zip}
                  onChange={set("zip")}
                  maxLength={5}
                  className="border border-gray-300 px-4 py-3 font-body text-sm text-vv-black placeholder-gray-400 focus:outline-none focus:border-vv-black transition-colors w-24"
                />
              </div>
            </div>
          </section>

          {/* Shipping method */}
          <section className="mb-8">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-vv-black mb-3">Shipping Method</h2>
            <div className="border border-vv-black px-4 py-3.5 flex items-center justify-between bg-vv-gray/30">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-vv-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-vv-black" />
                </div>
                <div>
                  <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">Standard Shipping</p>
                  <p className="font-body text-xs text-vv-gray-mid">5–7 business days</p>
                </div>
              </div>
              <span className="font-heading text-xs font-bold text-vv-black">
                {shipping === 0 ? <span className="text-vv-teal">Free</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
          </section>

          {/* Submit + back */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => setSubmitted(true)}
              className="w-full sm:flex-1 font-heading text-sm font-bold uppercase tracking-widest2 py-4 bg-vv-black text-white hover:bg-vv-teal transition-colors duration-200"
            >
              Complete Order →
            </button>
            <Link
              href="/shop"
              className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors flex items-center gap-1"
            >
              ← Return to shop
            </Link>
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-2 mt-6">
            {["VISA", "MC", "AMEX", "Apple Pay", "PayPal"].map((m) => (
              <span key={m} className="font-heading text-[9px] uppercase tracking-wider border border-gray-200 px-1.5 py-0.5 text-gray-400 rounded-sm">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Order Summary ─────────────────────────── */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-[145px]">

          {/* Mobile toggle */}
          <button
            onClick={() => setSummaryOpen((o) => !o)}
            className="flex lg:hidden w-full items-center justify-between py-4 border-y border-gray-200 mb-4"
          >
            <span className="font-heading text-xs uppercase tracking-widest text-vv-teal flex items-center gap-2">
              <span>🛍</span>
              {summaryOpen ? "Hide order summary" : "Show order summary"}
              <span className="text-vv-black">{summaryOpen ? "▲" : "▼"}</span>
            </span>
            <span className="font-heading text-sm font-bold text-vv-black">${total.toFixed(2)}</span>
          </button>

          <AnimatePresence initial={false}>
            {(summaryOpen || true) && (
              <motion.div
                key="summary"
                initial={false}
                className="hidden lg:block"
              >
                <SummaryPanel items={items} subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: always visible when toggled */}
          <AnimatePresence>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden lg:hidden"
              >
                <SummaryPanel items={items} subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SummaryPanel({
  items,
  subtotal,
  discount,
  shipping,
  total,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="bg-vv-gray/40 border border-gray-200 p-6">
      {/* Items */}
      {items.length === 0 ? (
        <p className="font-body text-sm text-vv-gray-mid text-center py-6">Your bag is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-5">
          {items.map((item) => (
            <li key={`${item.product.id}-${item.size}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <div className="relative w-16 h-16 flex-shrink-0 bg-white overflow-hidden border border-gray-200">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover object-top"
                  style={{ filter: IMAGE_ENHANCE }}
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-vv-gray-mid text-white rounded-full font-heading text-[9px] flex items-center justify-center font-bold">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black font-semibold leading-tight line-clamp-2">
                  {item.product.name}
                </p>
                <p className="font-body text-xs text-vv-gray-mid mt-0.5">Size: {item.size}</p>
              </div>
              <p className="font-heading text-sm font-bold text-vv-black flex-shrink-0">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-body text-sm text-vv-gray-mid">Subtotal</span>
          <span className="font-body text-sm text-vv-gray-mid line-through">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-sm text-vv-teal">Discount (BLESSED26)</span>
          <span className="font-body text-sm text-vv-teal">−${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-sm text-vv-gray-mid">Shipping</span>
          <span className="font-body text-sm text-vv-gray-mid">
            {shipping === 0 ? <span className="text-vv-teal">Free</span> : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3 mt-1">
          <span className="font-heading text-sm font-bold uppercase tracking-widest text-vv-black">Total</span>
          <div className="text-right">
            <span className="font-heading text-lg font-black text-vv-black">${total.toFixed(2)}</span>
            <span className="font-body text-[10px] text-vv-gray-mid block">USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
