"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { collections } from "@/data/collections";

const tileVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function CollectionsGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 px-5 sm:px-10 max-w-screen-xl mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="font-heading font-semibold text-sm uppercase tracking-widest2 text-vv-black mb-8"
      >
        Shop by Collection
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {collections.slice(0, 6).map((collection, i) => (
          <motion.div
            key={collection.id}
            custom={i}
            variants={tileVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <Link
              href="/shop"
              className="group block relative overflow-hidden bg-vv-gray aspect-[4/5]"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-heading font-semibold text-sm uppercase tracking-widest2 text-white">
                  {collection.name}
                </p>
                <p className="font-body text-xs text-white/70 mt-1">{collection.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
