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
  const date = searchParams.get("date");
  const month = searchParams.get("month");
  const supabase = getSupabaseAdmin();

  // Per-day: blocked slots with their tuk tuk count
  if (date) {
    if (!DATE_RE.test(date))
      return NextResponse.json({ error: "Formato: YYYY-MM-DD" }, { status: 400 });

    const { data, error } = await supabase
      .from("blocked_slots")
      .select("time_slot, blocked_tuktuks")
      .eq("date", date);

    if (error) return NextResponse.json({ error: "Error al consultar" }, { status: 500 });

    // Also return day-level block for this date
    const { data: dayBlock } = await supabase
      .from("availability")
      .select("is_available, blocked_tuktuks")
      .eq("date", date)
      .single();

    return NextResponse.json({
      blocked_slots: (data || []).map((r) => ({
        time_slot: r.time_slot,
        blocked_tuktuks: r.blocked_tuktuks ?? 3,
      })),
      day_blocked_tuktuks: dayBlock?.is_available === false ? (dayBlock.blocked_tuktuks ?? 3) : 0,
    });
  }

  // Per-month: blocked days with tuk tuk count
  if (month) {
    if (!MONTH_RE.test(month))
      return NextResponse.json({ error: "Formato: YYYY-MM" }, { status: 400 });

    const [year, m] = month.split("-").map(Number);
    const startDate = `${month}-01`;
    const lastDay = new Date(year, m, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("availability")
      .select("date, is_available, blocked_tuktuks")
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

  // ── Slot-level blocking ──────────────────────────────────────────────────
  if (body.time_slot !== undefined) {
    const { date, time_slot, blocked_tuktuks } = body;

    if (!date || !DATE_RE.test(date) || isNaN(new Date(date).getTime()))
      return NextResponse.json({ error: "Fecha inválida (YYYY-MM-DD)" }, { status: 400 });
    if (!time_slot || !SLOT_RE.test(time_slot))
      return NextResponse.json({ error: "Horario inválido (HH:MM)" }, { status: 400 });

    const count = Number(blocked_tuktuks);
    if (!Number.isInteger(count) || count < 0 || count > 3)
      return NextResponse.json({ error: "blocked_tuktuks debe ser 0-3" }, { status: 400 });

    if (count === 0) {
      // Unblock: delete the row
      await supabase.from("blocked_slots").delete().eq("date", date).eq("time_slot", time_slot);
    } else {
      await supabase
        .from("blocked_slots")
        .upsert({ date, time_slot, blocked_tuktuks: count }, { onConflict: "date,time_slot" });
    }
    return NextResponse.json({ ok: true, date, time_slot, blocked_tuktuks: count });
  }

  // ── Day-level blocking ───────────────────────────────────────────────────
  const { date, blocked_tuktuks, is_available } = body;

  if (!date || !DATE_RE.test(date) || isNaN(new Date(date).getTime()))
    return NextResponse.json({ error: "Fecha inválida (YYYY-MM-DD)" }, { status: 400 });

  // is_available: true → unblock day entirely
  if (is_available === true) {
    await supabase.from("availability").delete().eq("date", date);
    return NextResponse.json({ ok: true, date, day_blocked_tuktuks: 0 });
  }

  const count = Number(blocked_tuktuks ?? 3);
  if (!Number.isInteger(count) || count < 1 || count > 3)
    return NextResponse.json({ error: "blocked_tuktuks debe ser 1-3" }, { status: 400 });

  const { data, error } = await supabase
    .from("availability")
    .upsert({ date, is_available: false, blocked_tuktuks: count }, { onConflict: "date" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  return NextResponse.json({ availability: data });
}
