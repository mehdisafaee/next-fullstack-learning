"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/features/products/product.api";
import type { Product } from "@/features/products/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {
        setError("Failed to load products");
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Products</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </main>
  );
}
