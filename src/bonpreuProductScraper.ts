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
  { product_id: number; price: number }[]
> {
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: process.env.SERVICE_USER_EMAIL!,
      password: process.env.SERVICE_USER_PASSWORD!,
    });
    if (signInError) throw signInError;

    const { data: user } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication failed");
    console.log(`Authenticated as ${JSON.stringify(user)}`);

    const products = await fetchProducts();
    console.log(`Fetched ${products.length} products from Supabase`);

    const productPrices = await Promise.all(
      products.map(async (product) => {
        const price = await scrapeProductPrice(product.url);
        return { product_id: product.id, price };
      })
    );

    const { data, error } = await supabase
      .from("product_prices")
      .insert(productPrices)
      .select();

    if (error) {
      console.error(`Error inserting product prices: ${error.message}`);
      throw error;
    }
    console.log(`Inserted ${data?.length} price records`);

    return productPrices;
  } catch (error) {
    console.error("Error in scrapeBonpreuProducts:", error);
    throw error;
  }
}
