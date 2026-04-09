"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getFeaturedProducts } from "@/data/products";

const tagColors: Record<string, string> = {
  New: "bg-vv-teal text-white",
  "Best Seller": "bg-vv-orange text-white",
  Limited: "bg-vv-black text-white",
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 px-5 sm:px-10 max-w-screen-xl mx-auto" ref={ref}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black">
          New Drop
        </h2>
        <Link
          href="/shop"
          className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors border-b border-vv-gray-mid pb-px"
        >
          View All
        </Link>
      </motion.div>

      {/* 4-col grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {featured.map((product, i) => (
          <motion.div
            key={product.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <Link href={`/shop/${product.id}`} className="group block">
              <div className="relative aspect-square bg-vv-gray overflow-hidden mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: "contrast(1.08) brightness(1.04) saturate(1.2)" }}
                />
                {product.tag && (
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-heading font-semibold uppercase tracking-widest px-2 py-0.5 ${tagColors[product.tag]}`}
                  >
                    {product.tag}
                  </span>
                )}
              </div>
              <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-medium leading-snug">
                {product.name}
              </p>
              <p className="font-body text-sm text-vv-gray-mid mt-0.5">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
