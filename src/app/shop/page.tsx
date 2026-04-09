"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [toast, setToast] = useState<string | null>(null);
  const { addItem } = useCart();

  const filtered = products.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  const handleAddToCart = (product: Product, size: string) => {
    addItem(product, size);
    setToast(product.name);
    setTimeout(() => setToast(null), 3000);
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
                onAddToCart={handleAddToCart}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Email signup ─────────────────────────────────────── */}
      <EmailSignup />

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

function getUrgency(id: string) {
  const n = id.charCodeAt(1) + id.charCodeAt(2);
  return { viewers: 3 + (n % 11), stock: 4 + (n % 7) };
}

/* ── Product Card ──────────────────────────────────────────────────────── */
function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product, size: string) => void;
}) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [pickedSize, setPickedSize] = useState<string | null>(null);
  const urgency = getUrgency(product.id);

  const handleSizePick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
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
      <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-vv-gray overflow-hidden mb-3">
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
      </Link>

      {/* Info */}
      <Link href={`/shop/${product.id}`} className="block">
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
      </Link>
    </motion.div>
  );
}
