import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Product {
  name: string;
  // Add other product properties here
}

interface Price {
  created_at: string;
  price: number;
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

interface ProductDetails {
  product: Product | null;
  prices: Price[];
  stats: ProductStats | null;
}

export function useProductDetails(id: string) {
  const [details, setDetails] = useState<ProductDetails>({
    product: null,
    prices: [],
    stats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getProductDetails(id)
      .then((data) => {
        setDetails({
          product: data.product,
          prices: data.prices,
          stats: data.stats,
        });
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { ...details, loading, error };
}
