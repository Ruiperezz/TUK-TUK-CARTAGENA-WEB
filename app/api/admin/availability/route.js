import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";
import { checkAdminAuth } from "../../../../src/lib/auth";

export async function GET(request) {
  const authError = await checkAdminAuth(request);
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
  const authError = await checkAdminAuth(request);
  if (authError) return authError;

  const { date, is_available } = await request.json();

  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !DATE_RE.test(date) || isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "Fecha inválida (YYYY-MM-DD)" }, { status: 400 });
  }
  if (is_available !== undefined && typeof is_available !== "boolean") {
    return NextResponse.json({ error: "is_available debe ser boolean" }, { status: 400 });
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
