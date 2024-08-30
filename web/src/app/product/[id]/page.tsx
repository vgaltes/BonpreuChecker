"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslations } from "next-intl";
import PageLayout from "@/components/PageLayout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Price {
  created_at: string;
  price: number;
}

interface Product {
  name: string;
}

interface ProductStats {
  last_price: number;
  biggest_rise_absolute_value: number;
  biggest_rise_percentage: number;
  biggest_rise_date: string;
  biggest_drop_absolute_value: number;
  biggest_drop_percentage: number;
  biggest_drop_date: string;
  biggest_price_ever: number;
  lowest_price_ever: number;
}

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const translate = useTranslations("ProductDetail");
  const translateProducts = useTranslations("Products");

  useEffect(() => {
    if (id) {
      fetch(`/api/product/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.product);
          setPrices(data.prices);
          setStats(data.stats);
        });
    }
  }, [id]);

  if (!product) return <div>{translate("loading")}</div>;

  const maxPrice = Math.max(...prices.map((p) => p.price));
  const yAxisMax = Math.ceil(maxPrice * 1.2); // Increase the max by 20%

  const chartData = {
    labels: prices.map((p) => new Date(p.created_at).toLocaleDateString()),
    datasets: [
      {
        label: translate("price"),
        data: prices.map((p) => p.price),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: translate("date"),
        },
      },
      y: {
        beginAtZero: true,
        max: yAxisMax,
        title: {
          display: true,
          text: translate("price"),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <PageLayout>
      <h1 className="text-3xl font-semibold mb-6">
        {translateProducts(product.name)}
      </h1>
      <h2 className="text-2xl font-semibold mb-4">{translate("priceChart")}</h2>
      <Line data={chartData} options={chartOptions} />
      <h2 className="text-2xl font-semibold mb-4">{translate("priceTable")}</h2>
      <div className="bg-card p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 font-semibold">{translate("date")}</th>
                <th className="px-4 py-3 font-semibold text-right">
                  {translate("price")}
                </th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price, index) => (
                <tr
                  key={price.created_at}
                  className={`${
                    index % 2 === 0 ? "bg-card" : "bg-muted/50"
                  } hover:bg-muted/70 transition-colors`}
                >
                  <td className="px-4 py-3">
                    {new Date(price.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {price.price.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {stats && (
        <>
          <h2 className="text-2xl font-semibold mb-4 mt-6">
            {translate("productStats")}
          </h2>
          <div className="bg-card p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>{translate("lastPrice")}:</strong>{" "}
                  {stats.last_price.toFixed(2)} €
                </p>
                <p>
                  <strong>{translate("biggestPriceEver")}:</strong>{" "}
                  {stats.biggest_price_ever.toFixed(2)} €
                </p>
                <p>
                  <strong>{translate("lowestPriceEver")}:</strong>{" "}
                  {stats.lowest_price_ever.toFixed(2)} €
                </p>
              </div>
              <div>
                <p>
                  <strong>{translate("biggestRise")}:</strong>{" "}
                  {stats.biggest_rise_absolute_value.toFixed(2)} € (
                  {stats.biggest_rise_percentage.toFixed(2)}%)
                </p>
                <p>
                  <strong>{translate("biggestRiseDate")}:</strong>{" "}
                  {new Date(stats.biggest_rise_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>{translate("biggestDrop")}:</strong>{" "}
                  {stats.biggest_drop_absolute_value.toFixed(2)} € (
                  {stats.biggest_drop_percentage.toFixed(2)}%)
                </p>
                <p>
                  <strong>{translate("biggestDropDate")}:</strong>{" "}
                  {new Date(stats.biggest_drop_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
