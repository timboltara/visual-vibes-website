"use client";

import { products } from "@/data/products";
import ShopFilterPage from "@/components/shop/ShopFilterPage";

const newBase = products.filter((p) => p.tag === "New");

const hero = (
  <div className="relative bg-vv-black overflow-hidden" style={{ minHeight: "280px" }}>
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 30% 60%, #e8622a 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, #bf4f1e 0%, transparent 45%)",
      }}
    />
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[280px]">
      <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-3">
        Just Dropped
      </p>
      <h1
        className="font-heading font-black text-white uppercase leading-none"
        style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
      >
        New Drop
      </h1>
      <p className="font-body text-gray-400 text-sm max-w-xs mx-auto mt-4">
        Fresh designs, bold faith. {newBase.length} new pieces — don&apos;t sleep on these.
      </p>
    </div>
  </div>
);

export default function NewDropPage() {
  return (
    <ShopFilterPage
      baseProducts={newBase}
      title="New Drop"
      showGenderFilter={true}
      showTrustBar={false}
      heroSlot={hero}
    />
  );
}
