"use client";

import { products } from "@/data/products";
import ShopFilterPage from "@/components/shop/ShopFilterPage";

const womensBase = products.filter((p) => p.gender !== "mens");

export default function WomensPage() {
  return (
    <ShopFilterPage
      baseProducts={womensBase}
      title="For Her"
      subtitle="Women's Collection"
      showGenderFilter={false}
      showTrustBar={true}
    />
  );
}
