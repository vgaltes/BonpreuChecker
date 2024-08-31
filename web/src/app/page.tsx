"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

interface Product {
  id: number;
  name: string;
}

interface PriceChange {
  product_id: number;
  product_name: string;
  change: number;
  date: string;
}

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [priceChanges, setPriceChanges] = useState<{
    rises: PriceChange[];
    drops: PriceChange[];
  }>({ rises: [], drops: [] });
  const translate = useTranslations("Home");
  const translateProducts = useTranslations("Products");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("/api/price-changes")
      .then((res) => res.json())
      .then((data) => setPriceChanges(data));
  }, []);

  return (
    <PageLayout>
      <h2 className="text-xl font-semibold mb-6">{translate("title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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

      {(priceChanges.rises.length > 0 || priceChanges.drops.length > 0) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {translate("recentChanges")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priceChanges.rises.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-red-600">
                  {translate("biggestRises")}
                </h3>
                <ul className="space-y-2">
                  {priceChanges.rises.map((rise) => (
                    <li key={rise.product_id}>
                      <Link
                        href={`/product/${rise.product_id}`}
                        className="hover:underline"
                      >
                        {translateProducts(rise.product_name)}: +
                        {rise.change.toFixed(2)}%
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {priceChanges.drops.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">
                  {translate("biggestDrops")}
                </h3>
                <ul className="space-y-2">
                  {priceChanges.drops.map((drop) => (
                    <li key={drop.product_id}>
                      <Link
                        href={`/product/${drop.product_id}`}
                        className="hover:underline"
                      >
                        {translateProducts(drop.product_name)}:{" "}
                        {drop.change.toFixed(2)}%
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
