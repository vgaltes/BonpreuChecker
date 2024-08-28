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
  const translateProducts = useTranslations("Products");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <PageLayout>
      <h2 className="text-xl font-semibold mb-6">{translate("title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <div className="relative pt-[75%]">
              <Image
                src={`/img/${product.name}.webp`}
                alt={translateProducts(product.name)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h3 className="text-lg font-semibold mb-2">
                {translateProducts(product.name)}
              </h3>
              <Link
                href={`/product/${product.id}`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors inline-block mt-auto"
                prefetch={false}
              >
                {translate("viewDetails")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
