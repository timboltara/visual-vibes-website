"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 75;
const PROMO_DISCOUNT = 0.15;
const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

export default function CartDrawer() {
  const { items, count, subtotal, drawerOpen, closeDrawer, removeItem } = useCart();

  const discounted = subtotal * (1 - PROMO_DISCOUNT);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-semibold uppercase tracking-widest text-vv-black">
                  Your Bag
                </span>
                {count > 0 && (
                  <span className="bg-vv-orange text-white font-heading text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <button onClick={closeDrawer} aria-label="Close cart">
                <FiX size={20} className="text-vv-black" />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="px-5 py-3 bg-vv-gray border-b border-gray-100">
                <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black mb-1.5">
                  {remainingForFreeShipping > 0 ? (
                    <>Add <span className="text-vv-teal">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping</>
                  ) : (
                    <span className="text-vv-teal">You qualify for free shipping!</span>
                  )}
                </p>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-vv-teal rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            {subtotal >= FREE_SHIPPING_THRESHOLD && (
              <div className="px-5 py-2.5 bg-vv-teal text-white text-center">
                <p className="font-heading text-[10px] uppercase tracking-widest">
                  ✓ Free shipping unlocked!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-5 text-center">
                  <p className="font-heading text-sm uppercase tracking-widest text-vv-gray-mid">
                    Your bag is empty
                  </p>
                  <p className="font-body text-xs text-vv-gray-mid">
                    Add some faith-forward pieces to get started.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-2 font-heading text-xs uppercase tracking-widest border border-vv-black px-6 py-2.5 hover:bg-vv-black hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <li key={`${item.product.id}-${item.size}`} className="flex gap-3 px-5 py-4">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-vv-gray overflow-hidden">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover object-top"
                          style={{ filter: IMAGE_ENHANCE }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-tight line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="font-body text-xs text-vv-gray-mid mt-0.5">
                          Size: {item.size} · Qty: {item.quantity}
                        </p>
                        <p className="font-heading text-sm text-vv-black font-semibold mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-gray-300 hover:text-vv-black transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer — only show when items exist */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 pt-4 pb-5 space-y-3 bg-white">

                {/* Promo code savings */}
                <div className="bg-vv-gray rounded px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black">
                      Promo code <span className="text-vv-orange font-bold">BLESSED26</span> applied
                    </p>
                    <p className="font-body text-xs text-vv-gray-mid mt-0.5">15% off your first order</p>
                  </div>
                  <span className="font-heading text-xs text-vv-teal font-semibold">
                    −${(subtotal * PROMO_DISCOUNT).toFixed(2)}
                  </span>
                </div>

                {/* Totals */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-vv-gray-mid">Subtotal</span>
                    <span className="font-body text-sm text-vv-gray-mid line-through">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-heading text-sm uppercase tracking-widest text-vv-black font-semibold">Total after discount</span>
                    <span className="font-heading text-sm text-vv-teal font-bold">${discounted.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full bg-vv-black text-white font-heading text-xs font-bold uppercase tracking-widest py-4 text-center hover:bg-vv-teal transition-colors duration-200"
                >
                  Checkout Now →
                </Link>
                <p className="font-body text-[10px] text-vv-gray-mid text-center">
                  Secure checkout · Use <strong>BLESSED26</strong> at checkout for 15% off
                </p>

                {/* Payment icons */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {["VISA", "MC", "AMEX", "PayPal"].map((m) => (
                    <span key={m} className="font-heading text-[9px] uppercase tracking-wider border border-gray-200 px-1.5 py-0.5 text-gray-400 rounded-sm">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
