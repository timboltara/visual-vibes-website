"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

const IMAGE_ENHANCE = "contrast(1.08) brightness(1.04) saturate(1.2)";

const tagColors: Record<string, string> = {
  New: "bg-vv-black text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

// Kings Collection: crown & royalty-themed designs
const kingsProductIds = ["p3", "p8", "p9", "p10", "p13", "p20", "p21"];
const collectionProducts = products.filter((p) => kingsProductIds.includes(p.id));

export default function KingsCollectionPage() {
  const [toast, setToast] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (product: Product, size: string) => {
    addItem(product, size, "Classic");
    setToast(product.name);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="pt-[129px] min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-vv-black overflow-hidden" style={{ minHeight: "300px" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 70% 60%, #e8622a 0%, transparent 55%), radial-gradient(ellipse at 25% 30%, #bf4f1e 0%, transparent 45%)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[300px]">
          <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-3">Revelation 19:16</p>
          <h1 className="font-heading font-black text-white uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
            The Kings<br />Collection
          </h1>
          <p className="font-body text-gray-400 text-sm max-w-sm mx-auto mt-4">
            Crown and royalty-themed pieces for those who know who they belong to — the King of Kings.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 pt-6">
        <nav className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
          <Link href="/collections" className="hover:text-vv-black transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-vv-black">The Kings Collection</span>
        </nav>
      </div>

      {/* Grid */}
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid">{collectionProducts.length} pieces</p>
          <Link href="/collections" className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors border-b border-vv-gray-mid pb-px">
            All Collections
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>

      {/* Scripture callout */}
      <section className="bg-vv-black text-white py-16 px-6 text-center mt-8">
        <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-4">King of Kings</p>
        <p className="font-heading font-black text-white uppercase leading-none" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
          &ldquo;He reigns forever<br />and ever.&rdquo;
        </p>
        <p className="font-heading text-xs uppercase tracking-widest2 text-white/40 mt-3">Revelation 11:15</p>
        <Link href="/collections/faith-collection" className="inline-block mt-8 border border-white/30 text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-8 py-3 hover:bg-white hover:text-vv-black transition-colors duration-300">
          View The Faith Collection
        </Link>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-50 bg-vv-black text-white font-heading text-xs uppercase tracking-widest px-5 py-3 shadow-xl flex items-center gap-2">
            <span className="text-vv-orange font-bold">✓</span> Added to bag!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product, size: string) => void }) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [pickedSize, setPickedSize] = useState<string | null>(null);

  const handleSizePick = (e: React.MouseEvent, size: string) => {
    e.preventDefault(); e.stopPropagation();
    setPickedSize(size);
    setTimeout(() => { onAddToCart(product, size); setPickedSize(null); }, 200);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="group">
      <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-vv-gray overflow-hidden mb-3">
        <Image src={product.image} alt={product.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" style={{ filter: IMAGE_ENHANCE }} />
        {product.tag && <span className={`absolute top-2 left-2 text-[10px] font-heading font-semibold uppercase tracking-widest px-2 py-0.5 ${tagColors[product.tag]}`}>{product.tag}</span>}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm p-2">
          <p className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid mb-1.5 text-center">Quick Add</p>
          <div className="flex gap-1 justify-center flex-wrap">
            {product.sizes.map((size) => (
              <button key={size} onMouseEnter={() => setHoveredSize(size)} onMouseLeave={() => setHoveredSize(null)} onClick={(e) => handleSizePick(e, size)}
                className={`font-heading text-[10px] uppercase tracking-wide px-2 py-1 border transition-all duration-100 ${pickedSize === size ? "border-vv-orange bg-vv-orange text-white" : hoveredSize === size ? "border-vv-black bg-vv-black text-white" : "border-gray-300 text-vv-black hover:border-vv-black"}`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </Link>
      <Link href={`/shop/${product.id}`} className="block">
        <p className="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-snug line-clamp-2">{product.name}</p>
        <p className="font-body text-sm text-vv-black font-semibold mt-0.5">${product.price.toFixed(2)}</p>
      </Link>
    </motion.div>
  );
}
