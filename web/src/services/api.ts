import { supabase } from "../lib/supabaseClient";

export const api = {
  getProducts: async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    return data;
  },

  getPriceChanges: async () => {
    const response = await fetch("/api/price-changes");
    if (!response.ok) throw new Error("Failed to fetch price changes");
    return response.json();
  },

  getProductDetails: async (id: string) => {
    const response = await fetch(`/api/product/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product details");
    return response.json();
  },
};
