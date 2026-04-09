"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

const tagColors: Record<string, string> = {
  New: "bg-vv-teal text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

const categoryLabels: Record<string, string> = {
  hoodies: "Hoodies",
  tshirts: "T-Shirts",
  sweaters: "Sweaters",
  jerseys: "Jerseys",
  jackets: "Jackets",
};

// Seeded by product id so numbers are stable per product but varied across them
function getSocialProof(id: string) {
  const a = id.charCodeAt(id.length - 1);
  const b = id.charCodeAt(1);
  const c = id.charCodeAt(0);
  const viewing = 12 + ((a * 7 + b * 3) % 89);       // 12–100
  const reviews = 38 + ((b * 11 + c * 5 + a) % 214); // 38–251
  const rating = 4.6 + ((a + b) % 5) * 0.08;          // 4.6–4.9
  return { viewing, reviews, rating: Math.min(rating, 5).toFixed(1) };
}

export default function ProductPageClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState(false);
  const { addItem, closeDrawer } = useCart();
  const router = useRouter();
  const social = getSocialProof(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1400);
      return;
    }
    addItem(product, selectedSize);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1400);
      return;
    }
    addItem(product, selectedSize);
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="pt-[129px] min-h-screen bg-white">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 pt-6 pb-0">
        <nav className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
          <Link href="/" className="hover:text-vv-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-vv-black transition-colors">Shop</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-vv-black transition-colors">
            {categoryLabels[product.category] ?? product.category}
          </Link>
          <span>/</span>
          <span className="text-vv-black truncate max-w-[180px]">{product.name}</span>
        </nav>
      </div>

      {/* ── Main layout ────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">

        {/* ── Left: Product Image ─────────────────────────────── */}
        <div className="lg:sticky lg:top-[145px]">
          <div className="relative aspect-square bg-vv-gray overflow-hidden w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover object-top"
              style={{ filter: IMAGE_ENHANCE }}
            />
            {product.tag && (
              <span className={`absolute top-4 left-4 text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1.5 ${tagColors[product.tag]}`}>
                {product.tag}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Product Details ──────────────────────────── */}
        <div className="flex flex-col gap-6 py-2">

          {/* Brand */}
          <p className="font-heading text-[10px] uppercase tracking-widest2 text-vv-gray-mid">
            Visual Vibes LLC
          </p>

          {/* Name + Price */}
          <div className="-mt-4">
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase leading-[1.05] text-vv-black">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4 mt-4">
              <p className="font-heading font-bold text-3xl text-vv-black">
                ${product.price.toFixed(2)}
              </p>
              {product.tag === "Best Seller" && (
                <span className="font-heading text-[10px] uppercase tracking-widest text-vv-orange">
                  Fan Favorite
                </span>
              )}
            </div>
          </div>

          {/* Stars + reviews */}
          <div className="flex items-center gap-2 -mt-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-vv-orange text-sm">★</span>
              ))}
            </div>
            <span className="font-body text-xs text-vv-gray-mid">
              ({social.rating}) · {social.reviews} reviews
            </span>
          </div>

          {/* Live urgency */}
          <div className="flex items-center gap-5 border-y border-gray-100 py-3 -mt-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vv-teal animate-pulse" />
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
                {social.viewing} viewing
              </p>
            </div>
            <p className="font-heading text-[10px] uppercase tracking-widest text-vv-orange font-semibold">
              Low stock
            </p>
          </div>

          {/* Description */}
          <p className="font-body text-sm text-vv-gray-mid leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">
                Select Size
              </p>
              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-heading text-[10px] uppercase tracking-widest text-vv-orange font-semibold"
                  >
                    Please select a size
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`font-heading text-xs uppercase tracking-wide w-14 h-12 border transition-all duration-150 ${
                    selectedSize === size
                      ? "border-vv-black bg-vv-black text-white"
                      : sizeError
                      ? "border-vv-orange/60 text-vv-black hover:border-vv-black"
                      : "border-gray-200 text-vv-black hover:border-vv-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full font-heading text-sm font-bold uppercase tracking-widest2 py-4 bg-vv-black text-white hover:bg-vv-teal transition-colors duration-200"
            >
              {selectedSize ? `Add to Bag — ${selectedSize}` : "Add to Bag"}
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full font-heading text-sm font-bold uppercase tracking-widest2 py-4 bg-vv-orange text-white hover:bg-orange-600 transition-colors duration-200"
            >
              Buy Now
            </button>
          </div>

          {/* Trust bar */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
            {[
              ["✓", "Free shipping $75+"],
              ["✓", "Easy returns"],
              ["✓", "Secure checkout"],
              ["✓", "Sizes XS–3XL"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2">
                <span className="font-heading text-vv-teal text-xs font-bold">{icon}</span>
                <span className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Product details */}
          <div className="border-t border-gray-100 pt-5">
            <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black font-bold mb-3">
              Details
            </p>
            <ul className="font-body text-sm text-vv-gray-mid space-y-2 leading-relaxed">
              <li>· Premium quality construction</li>
              <li>· Faith-forward design — wear your beliefs</li>
              <li>· Unisex fit — see size chart</li>
              <li>· Machine washable, color-safe</li>
            </ul>
          </div>

          {/* Promo nudge */}
          <div className="bg-vv-gray px-5 py-4">
            <p className="font-heading text-xs uppercase tracking-widest text-vv-black">
              Use <span className="text-vv-orange font-bold">BLESSED26</span> — 15% off your first order
            </p>
          </div>
        </div>
      </div>

      {/* ── Related Products ───────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 mt-2 py-14">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black">
                You May Also Like
              </h2>
              <Link
                href="/shop"
                className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors border-b border-vv-gray-mid pb-px"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                  <div className="relative aspect-square bg-vv-gray overflow-hidden mb-3">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: IMAGE_ENHANCE }}
                    />
                    {p.tag && (
                      <span className={`absolute top-2 left-2 text-[9px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 ${tagColors[p.tag]}`}>
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-medium leading-snug line-clamp-2">
                    {p.name}
                  </p>
                  <p className="font-body text-sm text-vv-gray-mid mt-0.5">
                    ${p.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Toast ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-vv-black text-white font-heading text-xs uppercase tracking-widest px-5 py-3 shadow-xl flex items-center gap-2"
          >
            <span className="text-vv-teal font-bold">✓</span>
            Added to bag!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
