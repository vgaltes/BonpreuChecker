import axios from "axios";
import * as cheerio from "cheerio";
import { supabase } from "./supabaseClient";

interface Product {
  id: number;
  url: string;
}

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("id, url");

  if (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }

  return data || [];
}

async function scrapeProductPrice(url: string): Promise<number> {
  console.log(`Scraping price for URL: ${url}`);
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const priceElement = $('div[data-test="price-container"] span');
    const priceText = priceElement.text().trim();
    const price = parseFloat(priceText.replace("€", "").replace(",", "."));

    if (isNaN(price)) {
      throw new Error(`Invalid price format: ${priceText}`);
    }

    return price;
  } catch (error) {
    console.error(`Error scraping price for ${url}:`, error);
    throw error;
  }
}

export async function scrapeBonpreuProducts(): Promise<
  { id: number; price: number }[]
> {
  try {
    const products = await fetchProducts();
    console.log(`Fetched ${products.length} products from Supabase`);

    const results = await Promise.all(
      products.map(async (product) => {
        const price = await scrapeProductPrice(product.url);
        return { id: product.id, price };
      })
    );

    return results;
  } catch (error) {
    console.error("Error in scrapeBonpreuProducts:", error);
    throw error;
  }
}
