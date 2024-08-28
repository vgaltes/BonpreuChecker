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

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const translate = useTranslations("ProductDetail");

  useEffect(() => {
    if (id) {
      fetch(`/api/product/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.product);
          setPrices(data.prices);
        });
    }
  }, [id]);

  if (!product) return <div>{translate("loading")}</div>;

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
    scales: {
      x: {
        type: "category" as const,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <h2>{translate("priceChart")}</h2>
      <Line data={chartData} options={chartOptions} />
      <table>
        <thead>
          <tr>
            <th>{translate("date")}</th>
            <th>{translate("price")}</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={price.created_at}>
              <td>{new Date(price.created_at).toLocaleDateString()}</td>
              <td>{price.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
