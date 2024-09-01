import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { getSecondsUntilNextUpdate } from "../../../lib/utils";

export async function GET() {
  const { data, error } = await supabase.from("products").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  const response = NextResponse.json(data);
  response.headers.set(
    "Cache-Control",
    `s-maxage=${getSecondsUntilNextUpdate()}, stale-while-revalidate`
  );
  return response;
}
