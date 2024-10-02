import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { getSecondsUntilNextUpdate } from "../../../lib/utils";

export const revalidate = 0; // Disable Next.js caching

export async function GET() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const { data: statsData, error: statsError } = await supabase
      .from("product_stats")
      .select(
        `
        product_id,
        biggest_rise_absolute_value,
        biggest_rise_percentage,
        biggest_rise_date,
        biggest_drop_absolute_value,
        biggest_drop_percentage,
        biggest_drop_date
      `
      )
      .or(
        `biggest_rise_date.gte.${thirtyDaysAgo.toISOString()},biggest_drop_date.gte.${thirtyDaysAgo.toISOString()}`
      )
      .order("biggest_rise_percentage", { ascending: false })
      .order("biggest_drop_percentage", { ascending: true })
      .limit(10);

    if (statsError) throw statsError;

    // Fetch product names
    const productIds = statsData.map((item) => item.product_id);
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    if (productsError) throw productsError;

    // Create a map of product id to product name
    const productNameMap = Object.fromEntries(
      productsData.map((p) => [p.id, p.name])
    );

    const rises = statsData
      .filter(
        (item) =>
          new Date(item.biggest_rise_date) >= thirtyDaysAgo &&
          item.biggest_rise_percentage > 0
      )
      .map((item) => ({
        product_id: item.product_id,
        product_name: productNameMap[item.product_id],
        change: item.biggest_rise_percentage,
        date: item.biggest_rise_date,
      }));

    const drops = statsData
      .filter(
        (item) =>
          new Date(item.biggest_drop_date) >= thirtyDaysAgo &&
          item.biggest_drop_percentage < 0
      )
      .map((item) => ({
        product_id: item.product_id,
        product_name: productNameMap[item.product_id],
        change: item.biggest_drop_percentage,
        date: item.biggest_drop_date,
      }));

    const response = NextResponse.json({ rises, drops });
    response.headers.set(
      "Cache-Control",
      `s-maxage=${getSecondsUntilNextUpdate()}, stale-while-revalidate`
    );

    return response;
  } catch (error) {
    console.error("Error fetching price changes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
