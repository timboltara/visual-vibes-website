"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { Product } from "@/types";
import EmailSignup from "@/components/home/EmailSignup";
import { useCart } from "@/context/CartContext";

const tagColors: Record<string, string> = {
  New: "bg-vv-teal text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const filters = [
  { label: "All", value: "all" },
  { label: "Hoodies", value: "hoodies" },
  { label: "T-Shirts", value: "tshirts" },
  { label: "Sweaters", value: "sweaters" },
  { label: "Jerseys", value: "jerseys" },
  { label: "Jackets", value: "jackets" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

// CSS filter to enhance product photos: boost contrast, brightness, and saturation
const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();

  const filtered = products.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  const showToast = (name: string) => {
    setToast(name);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product: Product, size: string) => {
    addItem(product, size);
    showToast(product.name);
  };

  const openQuickView = (p: Product) => {
    setQuickView(p);
    setSelectedSize(null);
  };

  return (
    <div className="pt-[129px] min-h-screen bg-white">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="px-5 sm:px-10 pt-10 pb-4 max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <h1 className="font-heading font-black text-4xl sm:text-5xl uppercase text-vv-black leading-none">
          Shop All
        </h1>
        <p className="font-body text-sm text-vv-gray-mid">{filtered.length} products</p>
      </div>

      {/* ── Trust bar ────────────────────────────────────────── */}
      <div className="bg-vv-gray border-y border-gray-200">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-2.5 flex flex-wrap gap-x-8 gap-y-1 justify-center sm:justify-start">
          {["Free shipping on orders $75+", "Easy returns", "Secure checkout", "Sizes XS–3XL"].map((t) => (
            <span key={t} className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid flex items-center gap-1.5">
              <span className="text-vv-teal">✓</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────── */}
      <div className="border-b border-gray-100 sticky top-[129px] z-40 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-10 flex gap-0 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`font-heading text-xs uppercase tracking-widest px-5 py-3.5 whitespace-nowrap border-b-2 transition-colors ${
                activeFilter === f.value
                  ? "border-vv-black text-vv-black"
                  : "border-transparent text-vv-gray-mid hover:text-vv-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={openQuickView}
                onAddToCart={(p, size) => handleAddToCart(p, size)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Email signup ─────────────────────────────────────── */}
      <EmailSignup />

      {/* ── Quick View Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setQuickView(null)}
          >
            <motion.div
              key="modal-panel"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white w-full sm:max-w-2xl flex flex-col sm:flex-row sm:max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full sm:w-5/12 aspect-square sm:aspect-auto sm:min-h-[420px] bg-vv-gray flex-shrink-0">
                <Image
                  src={quickView.image}
                  alt={quickView.name}
                  fill
                  className="object-cover object-top"
                  style={{ filter: IMAGE_ENHANCE }}
                />
                {quickView.tag && (
                  <span className={`absolute top-3 left-3 text-[10px] font-heading font-semibold uppercase tracking-widest px-2 py-0.5 ${tagColors[quickView.tag]}`}>
                    {quickView.tag}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-6 sm:p-8 flex flex-col gap-5 flex-1">
                <div>
                  <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-1">
                    Visual Vibes LLC
                  </p>
                  <h3 className="font-heading font-black text-xl uppercase leading-tight text-vv-black">
                    {quickView.name}
                  </h3>
                  <p className="font-heading text-2xl text-vv-black font-semibold mt-2">
                    ${quickView.price.toFixed(2)}
                  </p>
                </div>

                <p className="font-body text-sm text-vv-gray-mid leading-relaxed">
                  {quickView.description}
                </p>

                {/* Size selector */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">
                      Select Size
                    </p>
                    {!selectedSize && (
                      <p className="font-body text-xs text-vv-orange">← Required</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {quickView.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`font-heading text-xs uppercase tracking-wide px-4 py-2.5 border transition-all duration-150 ${
                          selectedSize === size
                            ? "border-vv-black bg-vv-black text-white"
                            : "border-gray-200 text-vv-black hover:border-vv-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col gap-2.5 mt-auto">
                  <button
                    onClick={() => {
                      if (!selectedSize) return;
                      handleAddToCart(quickView, selectedSize);
                      setQuickView(null);
                      setSelectedSize(null);
                    }}
                    disabled={!selectedSize}
                    className={`w-full font-heading text-xs font-semibold uppercase tracking-widest py-4 transition-colors duration-200 ${
                      selectedSize
                        ? "bg-vv-black text-white hover:bg-vv-teal"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {selectedSize ? "Add to Bag" : "Select a Size"}
                  </button>
                  <a
                    href="https://visualvibesllc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full font-heading text-xs font-semibold uppercase tracking-widest py-4 bg-vv-orange text-white text-center hover:bg-orange-600 transition-colors duration-200"
                  >
                    Buy Now → visualvibesllc.com
                  </a>
                </div>

                <p className="font-body text-[11px] text-vv-gray-mid text-center">
                  Free shipping on orders $75+ · Easy returns
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-vv-black text-white font-heading text-xs uppercase tracking-widest px-5 py-3 shadow-xl flex items-center gap-2"
          >
            <span className="text-vv-teal text-base">✓</span>
            Added to bag!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Stable urgency numbers per product (seeded by product id so they don't flicker)
function getUrgency(id: string) {
  const n = id.charCodeAt(1) + id.charCodeAt(2);
  return { viewers: 3 + (n % 11), stock: 4 + (n % 7) };
}

/* ── Product Card ──────────────────────────────────────────────────────── */
function ProductCard({
  product,
  onQuickView,
  onAddToCart,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product, size: string) => void;
}) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [pickedSize, setPickedSize] = useState<string | null>(null);
  const urgency = getUrgency(product.id);

  const handleSizePick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setPickedSize(size);
    setTimeout(() => {
      onAddToCart(product, size);
      setPickedSize(null);
    }, 200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      {/* Image container */}
      <div
        className="relative aspect-square bg-vv-gray overflow-hidden mb-3 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          style={{ filter: IMAGE_ENHANCE }}
        />

        {product.tag && (
          <span className={`absolute top-2 left-2 text-[10px] font-heading font-semibold uppercase tracking-widest px-2 py-0.5 ${tagColors[product.tag]}`}>
            {product.tag}
          </span>
        )}

        {/* Hover: inline size picker */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm p-2">
          <p className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid mb-1.5 text-center">
            Quick Add
          </p>
          <div className="flex gap-1 justify-center flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onMouseEnter={() => setHoveredSize(size)}
                onMouseLeave={() => setHoveredSize(null)}
                onClick={(e) => handleSizePick(e, size)}
                className={`font-heading text-[10px] uppercase tracking-wide px-2 py-1 border transition-all duration-100 ${
                  pickedSize === size
                    ? "border-vv-teal bg-vv-teal text-white"
                    : hoveredSize === size
                    ? "border-vv-black bg-vv-black text-white"
                    : "border-gray-300 text-vv-black hover:border-vv-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="cursor-pointer" onClick={() => onQuickView(product)}>
        <p className="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-snug line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="font-body text-sm text-vv-black font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p className="font-heading text-[9px] uppercase tracking-widest text-vv-orange">
            {urgency.stock} left
          </p>
        </div>
        <p className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid mt-0.5">
          {urgency.viewers} viewing now
        </p>
      </div>
    </motion.div>
  );
}
