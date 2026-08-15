import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";
import { checkAdminAuth } from "../../../../src/lib/auth";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const SLOT_RE = /^\d{2}:\d{2}$/;

export async function GET(request) {
  const authError = await checkAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const date = searchParams.get("date");

  const supabase = getSupabaseAdmin();

  // Per-day: return blocked slots for a specific date
  if (date) {
    if (!DATE_RE.test(date)) {
      return NextResponse.json({ error: "Formato: YYYY-MM-DD" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("blocked_slots")
      .select("time_slot")
      .eq("date", date);

    if (error) return NextResponse.json({ error: "Error al consultar" }, { status: 500 });
    return NextResponse.json({ blocked_slots: (data || []).map((r) => r.time_slot) });
  }

  // Per-month: return blocked days
  if (month) {
    if (!MONTH_RE.test(month)) {
      return NextResponse.json({ error: "Formato: YYYY-MM" }, { status: 400 });
    }
    const [year, m] = month.split("-").map(Number);
    const startDate = `${month}-01`;
    const lastDay = new Date(year, m, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date");

    if (error) return NextResponse.json({ error: "Error al consultar" }, { status: 500 });
    return NextResponse.json({ availability: data || [] });
  }

  return NextResponse.json({ error: "Parámetro requerido: month=YYYY-MM o date=YYYY-MM-DD" }, { status: 400 });
}

export async function POST(request) {
  const authError = await checkAdminAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const supabase = getSupabaseAdmin();

  // Toggle individual time slot
  if (body.time_slot !== undefined) {
    const { date, time_slot, blocked } = body;

    if (!date || !DATE_RE.test(date) || isNaN(new Date(date).getTime())) {
      return NextResponse.json({ error: "Fecha inválida (YYYY-MM-DD)" }, { status: 400 });
    }
    if (!time_slot || !SLOT_RE.test(time_slot)) {
      return NextResponse.json({ error: "Horario inválido (HH:MM)" }, { status: 400 });
    }
    if (typeof blocked !== "boolean") {
      return NextResponse.json({ error: "blocked debe ser boolean" }, { status: 400 });
    }

    if (blocked) {
      await supabase.from("blocked_slots").upsert({ date, time_slot }, { onConflict: "date,time_slot" });
    } else {
      await supabase.from("blocked_slots").delete().eq("date", date).eq("time_slot", time_slot);
    }

    return NextResponse.json({ ok: true, date, time_slot, blocked });
  }

  // Toggle whole day
  const { date, is_available } = body;

  if (!date || !DATE_RE.test(date) || isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "Fecha inválida (YYYY-MM-DD)" }, { status: 400 });
  }
  if (is_available !== undefined && typeof is_available !== "boolean") {
    return NextResponse.json({ error: "is_available debe ser boolean" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("availability")
    .upsert({ date, is_available: is_available ?? true }, { onConflict: "date" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  return NextResponse.json({ availability: data });
}
