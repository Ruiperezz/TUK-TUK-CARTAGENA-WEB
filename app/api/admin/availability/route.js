import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";
import { checkAdminAuth } from "../../../../src/lib/auth";

export async function GET(request) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Formato: YYYY-MM" }, { status: 400 });
  }

  const [year, m] = month.split("-").map(Number);
  const startDate = `${month}-01`;
  const lastDay = new Date(year, m, 0).getDate();
  const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date");

  if (error) {
    return NextResponse.json({ error: "Error al consultar" }, { status: 500 });
  }

  return NextResponse.json({ availability: data || [] });
}

export async function POST(request) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  const { date, is_available } = await request.json();

  if (!date) {
    return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("availability")
    .upsert(
      { date, is_available: is_available ?? true },
      { onConflict: "date" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }

  return NextResponse.json({ availability: data });
}
