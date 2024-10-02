import axios from "axios";
import * as cheerio from "cheerio";
import { supabase } from "./supabaseClient";

interface Product {
  id: number;
  url: string;
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

    await Promise.all(
      productPrices.map(async (productPrice) => {
        await updateProductStats(productPrice.product_id, productPrice.price);
      })
    );

    return productPrices;
  } catch (error) {
    console.error("Error in scrapeBonpreuProducts:", error);
    throw error;
  }
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

async function updateProductStats(
  productId: number,
  newPrice: number
): Promise<void> {
  // Fetch existing stats for the product
  const { data: existingStats, error: statsError } = await supabase
    .from("product_stats")
    .select("*")
    .eq("product_id", productId)
    .single();

  if (statsError && statsError.code !== "PGRST116") {
    throw new Error(`Error fetching product stats: ${statsError.message}`);
  }

  let stats = existingStats || {
    last_price: newPrice,
    biggest_rise_absolute_value: 0,
    biggest_rise_percentage: 0,
    biggest_rise_date: new Date().toISOString(),
    biggest_rise_from: newPrice,
    biggest_rise_to: newPrice,
    biggest_drop_absolute_value: 0,
    biggest_drop_percentage: 0,
    biggest_drop_date: new Date().toISOString(),
    biggest_drop_from: newPrice,
    biggest_drop_to: newPrice,
    biggest_price_ever: newPrice,
    lowest_price_ever: newPrice,
  };

  const priceDiff = newPrice - stats.last_price;
  const percentageDiff = (priceDiff / stats.last_price) * 100;

  if (priceDiff > stats.biggest_rise_absolute_value) {
    stats.biggest_rise_absolute_value = priceDiff;
    stats.biggest_rise_percentage = percentageDiff;
    stats.biggest_rise_date = new Date().toISOString();
    stats.biggest_rise_from = stats.last_price;
    stats.biggest_rise_to = newPrice;

    console.log(`price is bigger ${JSON.stringify(stats)}`);
  }

  if (priceDiff < stats.biggest_drop_absolute_value) {
    stats.biggest_drop_absolute_value = priceDiff;
    stats.biggest_drop_percentage = percentageDiff;
    stats.biggest_drop_date = new Date().toISOString();
    stats.biggest_drop_from = stats.last_price;
    stats.biggest_drop_to = newPrice;
  }

  stats.biggest_price_ever = Math.max(stats.biggest_price_ever, newPrice);
  stats.lowest_price_ever = Math.min(stats.lowest_price_ever, newPrice);
  stats.last_price = newPrice;

  // Update the product_stats table
  const { error: updateError } = await supabase
    .from("product_stats")
    .update(stats)
    .eq("product_id", productId);

  if (updateError)
    throw new Error(`Error updating product stats: ${updateError.message}`);
}
