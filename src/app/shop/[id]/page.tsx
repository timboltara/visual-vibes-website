"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

const tagColors: Record<string, string> = {
  New: "bg-vv-teal text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

function getUrgency(id: string) {
  const n = id.charCodeAt(1) + id.charCodeAt(2);
  return { viewers: 3 + (n % 11), stock: 4 + (n % 7) };
}

const categoryLabels: Record<string, string> = {
  hoodies: "Hoodies",
  tshirts: "T-Shirts",
  sweaters: "Sweaters",
  jerseys: "Jerseys",
  jackets: "Jackets",
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductPageContent product={product} related={related} />;
}

function ProductPageContent({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState(false);
  const { addItem } = useCart();
  const urgency = getUrgency(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1200);
      return;
    }
    addItem(product, selectedSize);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="pt-[129px] min-h-screen bg-white">

      {/* ── Breadcrumb ─────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 pt-6 pb-2">
        <nav className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
          <Link href="/" className="hover:text-vv-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-vv-black transition-colors">Shop</Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-vv-black transition-colors"
          >
            {categoryLabels[product.category] ?? product.category}
          </Link>
          <span>/</span>
          <span className="text-vv-black line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* ── Main product layout ────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

        {/* Left: Image */}
        <div className="relative aspect-square bg-vv-gray overflow-hidden w-full sticky top-[145px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover object-top"
            style={{ filter: IMAGE_ENHANCE }}
          />
          {product.tag && (
            <span
              className={`absolute top-4 left-4 text-[10px] font-heading font-semibold uppercase tracking-widest px-3 py-1 ${tagColors[product.tag]}`}
            >
              {product.tag}
            </span>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-6">

          {/* Brand + name + price */}
          <div>
            <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid mb-1">
              Visual Vibes LLC
            </p>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase leading-tight text-vv-black">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4 mt-3">
              <p className="font-heading text-3xl font-bold text-vv-black">
                ${product.price.toFixed(2)}
              </p>
              {product.tag === "Best Seller" && (
                <span className="font-heading text-[10px] uppercase tracking-widest text-vv-orange">
                  Fan Favorite
                </span>
              )}
            </div>
          </div>

          {/* Urgency signals */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-vv-teal animate-pulse" />
              <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
                {urgency.viewers} people viewing now
              </p>
            </div>
            <span className="text-gray-200">|</span>
            <p className="font-heading text-[10px] uppercase tracking-widest text-vv-orange">
              Only {urgency.stock} left
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
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-body text-xs text-vv-orange font-semibold"
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
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`font-heading text-xs uppercase tracking-wide px-5 py-3 border transition-all duration-150 ${
                    selectedSize === size
                      ? "border-vv-black bg-vv-black text-white"
                      : sizeError
                      ? "border-vv-orange text-vv-black hover:border-vv-black"
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
              className={`w-full font-heading text-sm font-bold uppercase tracking-widest py-4 transition-all duration-200 ${
                selectedSize
                  ? "bg-vv-black text-white hover:bg-vv-teal"
                  : "bg-vv-black text-white hover:bg-vv-teal"
              }`}
            >
              {selectedSize ? `Add to Bag — ${selectedSize}` : "Add to Bag"}
            </button>
            <a
              href="https://visualvibesllc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full font-heading text-sm font-bold uppercase tracking-widest py-4 bg-vv-orange text-white text-center hover:bg-orange-600 transition-colors duration-200 block"
            >
              Buy Now → visualvibesllc.com
            </a>
          </div>

          {/* Trust signals */}
          <div className="border-t border-gray-100 pt-5 grid grid-cols-2 gap-3">
            {[
              { icon: "🚚", text: "Free shipping $75+" },
              { icon: "↩", text: "Easy returns" },
              { icon: "🔒", text: "Secure checkout" },
              { icon: "📐", text: "Sizes XS–3XL" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <span className="text-vv-teal text-sm">{icon}</span>
                <span className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Product details */}
          <div className="border-t border-gray-100 pt-5">
            <p className="font-heading text-[10px] uppercase tracking-widest text-vv-black font-semibold mb-3">
              Product Details
            </p>
            <ul className="font-body text-sm text-vv-gray-mid space-y-1.5">
              <li>· Premium quality construction</li>
              <li>· Faith-forward design — wear your beliefs</li>
              <li>· Unisex sizing — see size chart for fit</li>
              <li>· Machine washable</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Related products ──────────────────────────── */}
      {related.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-12 border-t border-gray-100 mt-4">
          <h2 className="font-heading font-black text-2xl uppercase text-vv-black mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────── */}
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

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative aspect-square bg-vv-gray overflow-hidden mb-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          style={{ filter: IMAGE_ENHANCE }}
        />
        {product.tag && (
          <span
            className={`absolute top-2 left-2 text-[9px] font-heading font-semibold uppercase tracking-widest px-1.5 py-0.5 ${tagColors[product.tag]}`}
          >
            {product.tag}
          </span>
        )}
      </div>
      <p className="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-snug line-clamp-2">
        {product.name}
      </p>
      <p className="font-body text-sm text-vv-black font-semibold mt-0.5">
        ${product.price.toFixed(2)}
      </p>
    </Link>
  );
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
