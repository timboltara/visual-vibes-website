"use client";

import { products } from "@/data/products";
import EmailSignup from "@/components/home/EmailSignup";
import ShopFilterPage from "@/components/shop/ShopFilterPage";

export default function ShopPage() {
  return (
    <ShopFilterPage
      baseProducts={products}
      title="Shop All"
      subtitle="Faith You Can Wear"
      showGenderFilter={true}
      showTrustBar={true}
      footerSlot={<EmailSignup />}
    />
  );
}
