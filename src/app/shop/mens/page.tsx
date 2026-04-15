"use client";

import { products } from "@/data/products";
import ShopFilterPage from "@/components/shop/ShopFilterPage";

const mensBase = products.filter((p) => p.gender !== "womens");

export default function MensPage() {
  return (
    <ShopFilterPage
      baseProducts={mensBase}
      title="For Him"
      subtitle="Men's Collection"
      showGenderFilter={false}
      showTrustBar={true}
    />
  );
}
