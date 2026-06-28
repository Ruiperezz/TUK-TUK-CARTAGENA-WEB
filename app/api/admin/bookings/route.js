import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";
import { checkAdminAuth } from "../../../../src/lib/auth";

export async function GET(request) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (date) query = query.eq("date", date);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Error al consultar reservas" }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
