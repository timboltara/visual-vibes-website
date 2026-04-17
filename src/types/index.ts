export interface Product {
  id: string;
  name: string;
  price: number;
  category: "hoodies" | "tshirts" | "sweaters" | "jerseys" | "jackets" | "tank-tops" | "shorts" | "pants" | "swimwear" | "hawaiian-shirts";
  collection: string;
  image: string;
  tag?: "New" | "Best Seller" | "Limited";
  description: string;
  sizes: string[];
  gender?: "mens" | "womens" | "unisex";
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}
