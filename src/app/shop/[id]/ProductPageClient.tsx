"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

const tagColors: Record<string, string> = {
  New: "bg-vv-black text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

const FITS = ["Classic", "Oversized", "Heavyweight"] as const;

const COLORS = [
  { label: "Black", hex: "#1c1c1c" },
  { label: "White", hex: "#ffffff" },
  { label: "Grey", hex: "#9ca3af" },
  { label: "Red", hex: "#dc2626" },
] as const;

export default function ProductPageClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [selectedFit, setSelectedFit] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [fitError, setFitError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState<{ name: string; text: string; rating: number }[]>([]);
  const { addItem, closeDrawer } = useCart();
  const router = useRouter();

  // Random 7–19, rerolled each time the product page is visited
  const [viewing] = useState(() => Math.floor(Math.random() * 13) + 7);
  const lowStock = viewing > 15;
  const fanFavorite = viewing > 16;

  const validate = () => {
    let valid = true;
    if (!selectedFit) { setFitError(true); setTimeout(() => setFitError(false), 1400); valid = false; }
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 1400); valid = false; }
    return valid;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product, selectedSize!, selectedFit!);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    addItem(product, selectedSize!, selectedFit!);
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="pt-[129px] min-h-screen bg-white">

      {/* ── Main layout ────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">

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
              {fanFavorite && (
                <span className="font-heading text-[10px] uppercase tracking-widest text-vv-orange">
                  Fan Favorite
                </span>
              )}
            </div>
          </div>

          {/* Live urgency */}
          <div className="flex items-center gap-5 border-y border-gray-100 py-3 -mt-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vv-orange animate-pulse" />
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
                {viewing} viewing
              </p>
            </div>
            {lowStock && (
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-orange font-semibold">
                Low Stock
              </p>
            )}
          </div>

          {/* Description */}
          <p className="font-body text-sm text-vv-gray-mid leading-relaxed">
            {product.description}
          </p>

          {/* ── Color swatches ─────────────────────────────────── */}
          <div>
            <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold mb-3">
              Color — <span className="text-vv-gray-mid font-normal">{selectedColor}</span>
            </p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setSelectedColor(c.label)}
                  title={c.label}
                  className={`w-8 h-8 rounded-full transition-all duration-150 ${
                    selectedColor === c.label
                      ? "ring-2 ring-offset-2 ring-vv-black scale-110"
                      : "ring-1 ring-gray-200 hover:ring-gray-400"
                  } ${c.hex === "#ffffff" ? "border border-gray-200" : ""}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* ── Fit selector ───────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">
                Select Fit
              </p>
              <AnimatePresence>
                {fitError && (
                  <motion.p
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-heading text-[10px] uppercase tracking-widest text-vv-orange font-semibold"
                  >
                    Please select a fit
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-2 flex-wrap">
              {FITS.map((fit) => (
                <button
                  key={fit}
                  onClick={() => { setSelectedFit(fit); setFitError(false); }}
                  className={`font-heading text-xs uppercase tracking-wide px-5 h-12 border transition-all duration-150 ${
                    selectedFit === fit
                      ? "border-vv-black bg-vv-black text-white"
                      : fitError
                      ? "border-vv-orange/60 text-vv-black hover:border-vv-black"
                      : "border-gray-200 text-vv-black hover:border-vv-black"
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* ── Size selector ──────────────────────────────────── */}
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
              className="w-full font-heading text-sm font-bold uppercase tracking-widest2 py-4 bg-vv-black text-white hover:bg-vv-orange transition-colors duration-200"
            >
              {selectedSize && selectedFit
                ? `Add to Bag — ${selectedFit} / ${selectedSize}`
                : "Add to Bag"}
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
                <span className="font-heading text-vv-orange text-xs font-bold">{icon}</span>
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

      {/* ── Reviews ────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-14">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-vv-orange text-base">★</span>
              ))}
              <span className="font-heading text-xs text-vv-gray-mid ml-2 uppercase tracking-widest">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          {/* Existing reviews */}
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-6 mb-10">
              {reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= r.rating ? "text-vv-orange" : "text-gray-200"}>★</span>
                    ))}
                    <span className="font-heading text-xs uppercase tracking-widest text-vv-black ml-2">{r.name}</span>
                  </div>
                  <p className="font-body text-sm text-vv-gray-mid leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-vv-gray-mid mb-8">
              No reviews yet — be the first to share your thoughts!
            </p>
          )}

          {/* Write a review form */}
          <div className="border border-gray-100 p-6 max-w-lg">
            <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold mb-5">
              Write a Review
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-1.5 block">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setReviewRating(s)}
                      className={`text-2xl transition-colors ${s <= reviewRating ? "text-vv-orange" : "text-gray-200 hover:text-vv-orange"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-200 px-3 py-2.5 font-body text-sm text-vv-black focus:outline-none focus:border-vv-black transition-colors"
                />
              </div>
              <div>
                <label className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-1.5 block">
                  Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full border border-gray-200 px-3 py-2.5 font-body text-sm text-vv-black focus:outline-none focus:border-vv-black transition-colors resize-none"
                />
              </div>
              <button
                onClick={() => {
                  if (!reviewName.trim() || !reviewText.trim()) return;
                  setReviews((prev) => [...prev, { name: reviewName.trim(), text: reviewText.trim(), rating: reviewRating }]);
                  setReviewName("");
                  setReviewText("");
                  setReviewRating(5);
                }}
                className="font-heading text-xs uppercase tracking-widest bg-vv-black text-white py-3 px-8 hover:bg-vv-orange transition-colors self-start"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Toast ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-vv-black text-white font-heading text-xs uppercase tracking-widest px-5 py-3 shadow-xl flex items-center gap-2"
          >
            <span className="text-vv-orange font-bold">✓</span>
            Added to bag!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
