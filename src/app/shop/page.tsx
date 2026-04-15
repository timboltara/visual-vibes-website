"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiSliders, FiX } from "react-icons/fi";
import { products } from "@/data/products";
import { Product } from "@/types";
import EmailSignup from "@/components/home/EmailSignup";
import { useCart } from "@/context/CartContext";

const tagColors: Record<string, string> = {
  New: "bg-vv-black text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

// ── Filter definitions ────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Hoodies", value: "hoodies" },
  { label: "T-Shirts", value: "tshirts" },
  { label: "Sweaters", value: "sweaters" },
  { label: "Jerseys", value: "jerseys" },
  { label: "Jackets", value: "jackets" },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $75", min: 50, max: 75 },
  { label: "Over $75", min: 75, max: Infinity },
];

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

interface Filters {
  categories: string[];
  gender: "all" | "mens" | "womens";
  sizes: string[];
  priceRange: string | null;
  sort: SortOption;
}

const defaultFilters: Filters = {
  categories: [],
  gender: "all",
  sizes: [],
  priceRange: null,
  sort: "featured",
};

function countActiveFilters(f: Filters) {
  return (
    f.categories.length +
    (f.gender !== "all" ? 1 : 0) +
    f.sizes.length +
    (f.priceRange ? 1 : 0)
  );
}

function applyFilters(all: Product[], f: Filters): Product[] {
  let list = [...all];

  if (f.categories.length > 0)
    list = list.filter((p) => f.categories.includes(p.category));

  if (f.gender === "mens") list = list.filter((p) => p.gender !== "womens");
  if (f.gender === "womens") list = list.filter((p) => p.gender !== "mens");

  if (f.sizes.length > 0)
    list = list.filter((p) => f.sizes.some((s) => p.sizes.includes(s)));

  if (f.priceRange) {
    const range = PRICE_RANGES.find((r) => r.label === f.priceRange);
    if (range) list = list.filter((p) => p.price >= range.min && p.price < range.max);
  }

  if (f.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (f.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (f.sort === "newest") list = list.filter((p) => p.tag === "New").concat(list.filter((p) => p.tag !== "New"));

  return list;
}

// ── Accordion section ─────────────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-3 font-heading text-[10px] uppercase tracking-widest text-vv-black font-semibold"
      >
        {title}
        {open ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { addItem } = useCart();

  const results = applyFilters(products, filters);
  const activeCount = countActiveFilters(filters);

  const handleAddToCart = (product: Product, size: string) => {
    addItem(product, size);
    setToast(product.name);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleCategory = useCallback((val: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(val)
        ? f.categories.filter((c) => c !== val)
        : [...f.categories, val],
    }));
  }, []);

  const toggleSize = useCallback((val: string) => {
    setFilters((f) => ({
      ...f,
      sizes: f.sizes.includes(val)
        ? f.sizes.filter((s) => s !== val)
        : [...f.sizes, val],
    }));
  }, []);

  const clearAll = () => setFilters(defaultFilters);

  const SidebarContent = (
    <div className="flex flex-col gap-0">
      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="flex flex-col gap-1">
          {([
            { label: "Featured", value: "featured" },
            { label: "Price: Low to High", value: "price-asc" },
            { label: "Price: High to Low", value: "price-desc" },
            { label: "Newest", value: "newest" },
          ] as { label: string; value: SortOption }[]).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer py-1">
              <div className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                filters.sort === opt.value ? "border-vv-black" : "border-gray-300"
              }`}>
                {filters.sort === opt.value && <div className="w-2 h-2 rounded-full bg-vv-black" />}
              </div>
              <span className="font-body text-sm text-vv-black">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <label key={c.value} className="flex items-center gap-2.5 cursor-pointer py-1">
              <div
                onClick={() => toggleCategory(c.value)}
                className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  filters.categories.includes(c.value) ? "border-vv-black bg-vv-black" : "border-gray-300"
                }`}
              >
                {filters.categories.includes(c.value) && (
                  <span className="text-white font-bold" style={{ fontSize: "9px" }}>✓</span>
                )}
              </div>
              <span
                onClick={() => toggleCategory(c.value)}
                className="font-body text-sm text-vv-black cursor-pointer"
              >
                {c.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="For">
        <div className="flex flex-col gap-1">
          {[
            { label: "Everyone", value: "all" },
            { label: "For Him", value: "mens" },
            { label: "For Her", value: "womens" },
          ].map((g) => (
            <label key={g.value} className="flex items-center gap-2.5 cursor-pointer py-1">
              <div
                onClick={() => setFilters((f) => ({ ...f, gender: g.value as Filters["gender"] }))}
                className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  filters.gender === g.value ? "border-vv-black" : "border-gray-300"
                }`}
              >
                {filters.gender === g.value && <div className="w-2 h-2 rounded-full bg-vv-black" />}
              </div>
              <span
                onClick={() => setFilters((f) => ({ ...f, gender: g.value as Filters["gender"] }))}
                className="font-body text-sm text-vv-black cursor-pointer"
              >
                {g.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`font-heading text-[10px] uppercase tracking-wide px-3 py-2 border transition-all ${
                filters.sizes.includes(s)
                  ? "border-vv-black bg-vv-black text-white"
                  : "border-gray-200 text-vv-black hover:border-vv-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price" defaultOpen={false}>
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((r) => (
            <label key={r.label} className="flex items-center gap-2.5 cursor-pointer py-1">
              <div
                onClick={() => setFilters((f) => ({ ...f, priceRange: f.priceRange === r.label ? null : r.label }))}
                className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  filters.priceRange === r.label ? "border-vv-black" : "border-gray-300"
                }`}
              >
                {filters.priceRange === r.label && <div className="w-2 h-2 rounded-full bg-vv-black" />}
              </div>
              <span
                onClick={() => setFilters((f) => ({ ...f, priceRange: f.priceRange === r.label ? null : r.label }))}
                className="font-body text-sm text-vv-black cursor-pointer"
              >
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="pt-[129px] min-h-screen bg-white">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="px-5 sm:px-10 pt-10 pb-4 max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl uppercase text-vv-black leading-none">
            Shop All
          </h1>
          <p className="font-heading text-[10px] uppercase tracking-widest text-vv-orange mt-1">
            Faith You Can Wear
          </p>
        </div>
        <p className="font-body text-sm text-vv-gray-mid">{results.length} products</p>
      </div>

      {/* ── Trust bar ───────────────────────────────────────────── */}
      <div className="bg-vv-gray border-y border-gray-200">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-2.5 flex flex-wrap gap-x-8 gap-y-1 justify-center sm:justify-start">
          {["Free shipping on orders $75+", "Easy returns", "Secure checkout", "Sizes XS–3XL"].map((t) => (
            <span key={t} className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid flex items-center gap-1.5">
              <span className="text-vv-orange">✓</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Mobile filter bar ───────────────────────────────────── */}
      <div className="lg:hidden border-b border-gray-100 px-5 py-3 flex items-center justify-between sticky top-[129px] z-40 bg-white">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-heading text-xs uppercase tracking-widest text-vv-black border border-gray-200 px-4 py-2.5 hover:border-vv-black transition-colors"
        >
          <FiSliders size={13} />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 bg-vv-orange text-white font-heading text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button onClick={clearAll} className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* ── Main content: sidebar + grid ────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-6 flex gap-8 items-start">

        {/* Left sidebar (desktop only) */}
        <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0 sticky top-[145px] max-h-[calc(100vh-170px)]">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold flex items-center gap-2">
              <FiSliders size={12} /> Filters
              {activeCount > 0 && (
                <span className="w-4 h-4 bg-vv-orange text-white font-heading text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </p>
            {activeCount > 0 && (
              <button onClick={clearAll} className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors">
                Clear all
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 pr-1">
            {SidebarContent}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <p className="font-heading text-sm uppercase tracking-widest text-vv-gray-mid">No products match your filters</p>
              <button onClick={clearAll} className="font-heading text-xs uppercase tracking-widest text-vv-orange hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              <AnimatePresence mode="popLayout">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Email signup ─────────────────────────────────────────── */}
      <EmailSignup />

      {/* ── Mobile filter drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="filter-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">Filters</p>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <FiX size={18} className="text-vv-black" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {SidebarContent}
              </div>
              <div className="px-5 py-4 border-t border-gray-100">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-vv-black text-white font-heading text-xs font-bold uppercase tracking-widest py-4 hover:bg-vv-orange transition-colors"
                >
                  Show {results.length} Products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────────────── */}
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

function getUrgency(id: string) {
  const n = id.charCodeAt(1) + id.charCodeAt(2);
  return { viewers: 3 + (n % 11), stock: 4 + (n % 7) };
}

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
        {/* Hover: quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm p-2">
          <p className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid mb-1.5 text-center">Quick Add</p>
          <div className="flex gap-1 justify-center flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onMouseEnter={() => setHoveredSize(size)}
                onMouseLeave={() => setHoveredSize(null)}
                onClick={(e) => handleSizePick(e, size)}
                className={`font-heading text-[10px] uppercase tracking-wide px-2 py-1 border transition-all duration-100 ${
                  pickedSize === size
                    ? "border-vv-orange bg-vv-orange text-white"
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

      <Link href={`/shop/${product.id}`} className="block">
        <p className="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-snug line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <p className="font-body text-sm text-vv-black font-semibold">${product.price.toFixed(2)}</p>
          <p className="font-heading text-[9px] uppercase tracking-widest text-vv-orange">{urgency.stock} left</p>
        </div>
        <p className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid mt-0.5">
          {urgency.viewers} viewing
        </p>
      </Link>
    </motion.div>
  );
}
