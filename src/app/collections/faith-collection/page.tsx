"use client";

import Link from "next/link";
import { products } from "@/data/products";
import ShopFilterPage from "@/components/shop/ShopFilterPage";

const faithProductIds = ["p1", "p2", "p11", "p12", "p14", "p15", "p18", "p19"];
const faithBase = products.filter((p) => faithProductIds.includes(p.id));

const hero = (
  <>
    <div className="relative bg-vv-black overflow-hidden" style={{ minHeight: "300px" }}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 60%, #e8622a 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, #bf4f1e 0%, transparent 45%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[300px]">
        <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-3">
          Romans 1:16
        </p>
        <h1
          className="font-heading font-black text-white uppercase leading-none"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          The Faith
          <br />
          Collection
        </h1>
        <p className="font-body text-gray-400 text-sm max-w-sm mx-auto mt-4">
          Scripture-inspired designs for the believer who carries their faith into every part of
          daily life.
        </p>
      </div>
    </div>
    <div className="max-w-screen-xl mx-auto px-5 sm:px-10 pt-6 pb-2">
      <nav className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
        <Link href="/collections" className="hover:text-vv-black transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-vv-black">The Faith Collection</span>
      </nav>
    </div>
  </>
);

const footer = (
  <section className="bg-vv-black text-white py-16 px-6 text-center mt-8">
    <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-4">
      The Mission
    </p>
    <p
      className="font-heading font-black text-white uppercase leading-none"
      style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
    >
      &ldquo;I am not ashamed
      <br />
      of the Gospel.&rdquo;
    </p>
    <p className="font-heading text-xs uppercase tracking-widest2 text-white/40 mt-3">
      Romans 1:16
    </p>
    <Link
      href="/collections/kings-collection"
      className="inline-block mt-8 border border-white/30 text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-8 py-3 hover:bg-white hover:text-vv-black transition-colors duration-300"
    >
      View The Kings Collection
    </Link>
  </section>
);

export default function FaithCollectionPage() {
  return (
    <ShopFilterPage
      baseProducts={faithBase}
      title="The Faith Collection"
      showGenderFilter={true}
      showTrustBar={false}
      heroSlot={hero}
      footerSlot={footer}
    />
  );
}
