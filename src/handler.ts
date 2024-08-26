import { ScheduledHandler } from "aws-lambda";
import { scrapeBonpreuProducts } from "./bonpreuProductScraper";

export const run: ScheduledHandler = async () => {
  console.log("Scheduled task running at:", new Date().toISOString());

  try {
    const prices = await scrapeBonpreuProducts();
    console.log("Scraped prices:", prices);
  } catch (error) {
    console.error("Error scraping website:", error);
  }
};
