"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
      }
    };

    // Only fire after 10s on the page (don't immediately annoy)
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dismissed]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText("BLESSED26").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="exit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={dismiss}
          />
          <motion.div
            key="exit-popup"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-vv-black text-white max-w-md w-full p-8 relative pointer-events-auto">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>

              <p className="font-heading text-vv-orange text-xs uppercase tracking-widest mb-3">
                Wait — don&apos;t leave yet
              </p>

              <h2 className="font-heading font-black text-white uppercase leading-none mb-4"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}
              >
                {count > 0
                  ? "You left items in your bag"
                  : "15% off is waiting for you"}
              </h2>

              <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">
                {count > 0
                  ? `You have ${count} item${count > 1 ? "s" : ""} ready to go. Use code BLESSED26 at checkout to save 15% on your first order.`
                  : "Use code BLESSED26 at checkout for 15% off your entire first order. Faith-forward apparel you'll actually want to wear."}
              </p>

              {/* Promo code copy box */}
              <button
                onClick={copyCode}
                className="w-full border-2 border-dashed border-vv-orange px-4 py-3 flex items-center justify-between mb-5 hover:bg-white/5 transition-colors group"
              >
                <span className="font-heading text-xl font-bold tracking-widest text-vv-orange">
                  BLESSED26
                </span>
                <span className="font-heading text-xs uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                  {copied ? "✓ Copied!" : "Tap to copy"}
                </span>
              </button>

              <Link
                href="/shop"
                onClick={dismiss}
                className="block w-full bg-vv-orange text-white font-heading text-xs font-bold uppercase tracking-widest py-4 text-center hover:bg-orange-600 transition-colors mb-3"
              >
                Shop Now & Save 15%
              </Link>

              <button
                onClick={dismiss}
                className="block w-full font-heading text-xs uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors py-1"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
