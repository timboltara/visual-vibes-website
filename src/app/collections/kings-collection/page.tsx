"use client";

import Link from "next/link";
import { products } from "@/data/products";
import ShopFilterPage from "@/components/shop/ShopFilterPage";

const kingsProductIds = ["p3", "p8", "p9", "p10", "p13", "p20", "p21"];
const kingsBase = products.filter((p) => kingsProductIds.includes(p.id));

const hero = (
  <>
    <div className="relative bg-vv-black overflow-hidden" style={{ minHeight: "300px" }}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 70% 60%, #e8622a 0%, transparent 55%), radial-gradient(ellipse at 25% 30%, #bf4f1e 0%, transparent 45%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[300px]">
        <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-3">
          Revelation 19:16
        </p>
        <h1
          className="font-heading font-black text-white uppercase leading-none"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          The Kings
          <br />
          Collection
        </h1>
        <p className="font-body text-gray-400 text-sm max-w-sm mx-auto mt-4">
          Crown and royalty-themed pieces for those who know who they belong to — the King of Kings.
        </p>
      </div>
    </div>
    <div className="max-w-screen-xl mx-auto px-5 sm:px-10 pt-6 pb-2">
      <nav className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
        <Link href="/collections" className="hover:text-vv-black transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-vv-black">The Kings Collection</span>
      </nav>
    </div>
  </>
);

const footer = (
  <section className="bg-vv-black text-white py-16 px-6 text-center mt-8">
    <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-4">
      King of Kings
    </p>
    <p
      className="font-heading font-black text-white uppercase leading-none"
      style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
    >
      &ldquo;He reigns forever
      <br />
      and ever.&rdquo;
    </p>
    <p className="font-heading text-xs uppercase tracking-widest2 text-white/40 mt-3">
      Revelation 11:15
    </p>
    <Link
      href="/collections/faith-collection"
      className="inline-block mt-8 border border-white/30 text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-8 py-3 hover:bg-white hover:text-vv-black transition-colors duration-300"
    >
      View The Faith Collection
    </Link>
  </section>
);

export default function KingsCollectionPage() {
  return (
    <ShopFilterPage
      baseProducts={kingsBase}
      title="The Kings Collection"
      showGenderFilter={true}
      showTrustBar={false}
      heroSlot={hero}
      footerSlot={footer}
    />
  );
}
