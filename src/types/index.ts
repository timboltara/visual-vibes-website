export interface Product {
  id: string;
  name: string;
  price: number;
  category: "hoodies" | "tshirts" | "sweaters" | "jerseys" | "jackets";
  collection: string;
  image: string;
  tag?: "New" | "Best Seller" | "Limited";
  description: string;
  sizes: string[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}
