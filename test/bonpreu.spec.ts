import { scrapeBonpreuProductPrice } from "../src/bonpreuProductScraper";

describe("run function", () => {
  it("calls scrapeBonpreuProductPrice and logs the price", async () => {
    const price = await scrapeBonpreuProductPrice();
    expect(price).toBe(6.95);
  });
});
