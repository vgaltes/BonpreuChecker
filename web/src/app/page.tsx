"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PageLayout from "@/components/PageLayout";

type Props = {
  params: { locale: string };
};

interface Product {
  id: number;
  name: string;
}

export default function Home({ params: { locale } }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const translate = useTranslations("Home");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <PageLayout title={translate("title")}>
      <div className="grid grid-cols-3 gap-4">
        <h1>{translate("title")}</h1>
        {products.map((product) => (
          <div key={product.id} className="border p-4">
            <h2>{product.name}</h2>
            <Link href={`/product/${product.id}`}>
              <button className="mt-2 bg-blue-500 text-white p-2 rounded">
                {translate("viewDetails")}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
