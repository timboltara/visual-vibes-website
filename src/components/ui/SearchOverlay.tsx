"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch } from "react-icons/fi";
import { products } from "@/data/products";
import { Product } from "@/types";

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

const tagColors: Record<string, string> = {
  New: "bg-vv-teal text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Hoodies", value: "hoodies" },
  { label: "T-Shirts", value: "tshirts" },
  { label: "Sweaters", value: "sweaters" },
  { label: "Jerseys", value: "jerseys" },
  { label: "Jackets", value: "jackets" },
];

const GENDERS = [
  { label: "Everyone", value: "all" },
  { label: "For Him", value: "mens" },
  { label: "For Her", value: "womens" },
];

function scoreProduct(p: Product, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q) ||
    (p.tag?.toLowerCase().includes(q) ?? false) ||
    (p.gender?.toLowerCase().includes(q) ?? false)
  );
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [gender, setGender] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setCategory("all");
      setGender("all");
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = products.filter((p) => {
    if (!scoreProduct(p, query)) return false;
    if (category !== "all" && p.category !== category) return false;
    if (gender === "mens" && p.gender === "womens") return false;
    if (gender === "womens" && p.gender === "mens") return false;
    return true;
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-white flex flex-col"
        >
          {/* Header bar */}
          <div className="flex items-center gap-4 px-5 sm:px-10 border-b border-gray-100 h-16 flex-shrink-0">
            <FiSearch size={18} className="text-vv-gray-mid flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKU, or style…"
              className="flex-1 font-body text-base text-vv-black placeholder-gray-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-vv-gray-mid hover:text-vv-black transition-colors"
                aria-label="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors flex items-center gap-1.5 flex-shrink-0"
              aria-label="Close search"
            >
              Close <span className="hidden sm:inline text-gray-300 border border-gray-300 px-1 py-0.5 text-[9px] rounded">ESC</span>
            </button>
          </div>

          {/* Filters */}
          <div className="px-5 sm:px-10 py-3 border-b border-gray-100 flex flex-wrap gap-3 flex-shrink-0">
            {/* Category pills */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    category === c.value
                      ? "border-vv-black bg-vv-black text-white"
                      : "border-gray-200 text-vv-gray-mid hover:border-vv-black hover:text-vv-black"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 self-stretch" />

            {/* Gender pills */}
            <div className="flex gap-1.5 flex-wrap">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGender(g.value)}
                  className={`font-heading text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    gender === g.value
                      ? "border-vv-teal bg-vv-teal text-white"
                      : "border-gray-200 text-vv-gray-mid hover:border-vv-teal hover:text-vv-teal"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6">
            {/* No results */}
            {results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <FiSearch size={32} className="text-gray-200" />
                <p className="font-heading text-sm uppercase tracking-widest text-vv-gray-mid">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <button
                  onClick={() => { setQuery(""); setCategory("all"); setGender("all"); }}
                  className="font-heading text-[10px] uppercase tracking-widest text-vv-teal hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Default state: no query yet */}
            {!query && results.length === products.length && (
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-6">
                {results.length} products
              </p>
            )}

            {/* Query active: show count */}
            {query && results.length > 0 && (
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-5">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
            )}

            {/* Grid */}
            {results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {results.map((product) => (
                  <SearchResultCard key={product.id} product={product} onClose={onClose} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchResultCard({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <Link href={`/shop/${product.id}`} onClick={onClose} className="group block">
      <div className="relative aspect-square bg-vv-gray overflow-hidden mb-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          style={{ filter: IMAGE_ENHANCE }}
        />
        {product.tag && (
          <span className={`absolute top-1.5 left-1.5 text-[9px] font-heading font-bold uppercase tracking-widest px-1.5 py-0.5 ${tagColors[product.tag]}`}>
            {product.tag}
          </span>
        )}
        {product.gender && product.gender !== "unisex" && (
          <span className="absolute bottom-1.5 right-1.5 text-[9px] font-heading uppercase tracking-widest bg-white/90 text-vv-black px-1.5 py-0.5">
            {product.gender === "mens" ? "Him" : "Her"}
          </span>
        )}
      </div>
      <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black font-medium leading-snug line-clamp-2">
        {product.name}
      </p>
      <p className="font-body text-sm text-vv-gray-mid mt-0.5">
        ${product.price.toFixed(2)}
      </p>
    </Link>
  );
}
