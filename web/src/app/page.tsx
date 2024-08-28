"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{translate("title")}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src="/placeholder.svg"
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href={`/product/${product.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
                    prefetch={false}
                  >
                    {translate("viewDetails")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
