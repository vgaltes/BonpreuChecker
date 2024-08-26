import { ScheduledHandler } from "aws-lambda";
import { scrapeBonpreuProductPrice } from "./bonpreuProductScraper";

export const run: ScheduledHandler = async () => {
  console.log("Scheduled task running at:", new Date().toISOString());

  try {
    const price = await scrapeBonpreuProductPrice();

    console.log(`Current price: ${price}`);
  } catch (error) {
    console.error("Error scraping website:", error);
  }
};
