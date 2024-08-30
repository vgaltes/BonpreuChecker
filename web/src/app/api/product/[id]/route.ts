import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError) throw productError;

    const { data: prices, error: pricesError } = await supabase
      .from("product_prices")
      .select("price, created_at")
      .eq("product_id", id)
      .order("created_at", { ascending: true });

    if (pricesError) throw pricesError;

    const { data: stats, error: statsError } = await supabase
      .from("product_stats")
      .select("*")
      .eq("product_id", id)
      .single();

    if (statsError) throw statsError;

    return NextResponse.json({ product, prices, stats });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
