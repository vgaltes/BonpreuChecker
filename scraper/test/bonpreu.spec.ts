import { scrapeBonpreuProducts } from "../src/bonpreuProductScraper";

describe("run function", () => {
  it("calls scrapeBonpreuProductPrice and logs the price", async () => {
    const productPrices = await scrapeBonpreuProducts();
    expect(productPrices).toBeDefined();
    expect(productPrices).not.toHaveLength(0);
    expect(productPrices[0]["price"]).toBe(6.95);
  });
});
