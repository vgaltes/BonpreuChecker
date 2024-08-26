import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeBonpreuProductPrice(): Promise<number> {
  const url =
    "https://www.compraonline.bonpreuesclat.cat/products/bonpreu-oli-d-oliva-suau/84472";

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const priceText = $('div[data-test="price-container"] span').text().trim();
    const price = parseFloat(priceText.replace("€", "").replace(",", "."));

    return price;
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  }
}
