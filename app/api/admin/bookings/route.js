import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";
import { checkAdminAuth } from "../../../../src/lib/auth";

export async function GET(request) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  const VALID_STATUSES = ["pending", "confirmed", "cancelled"];
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });
  }

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
