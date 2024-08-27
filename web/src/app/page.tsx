"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  // Add other properties as needed
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4">
          <h2>{product.name}</h2>
          <Link href={`/product/${product.id}`}>
            <button className="mt-2 bg-blue-500 text-white p-2 rounded">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
