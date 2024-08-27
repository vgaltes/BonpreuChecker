import { useRouter } from "next/router";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState([]);

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

  if (!product) return <div>Loading...</div>;

  const chartData = {
    labels: prices.map((p) => new Date(p.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Price",
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
      <Line data={chartData} options={chartOptions} />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Price</th>
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
