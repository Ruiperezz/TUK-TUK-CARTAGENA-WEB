import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];
const MAX_PER_SLOT = 2;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

// Dates are open by default. Admin can block specific dates (is_available = false).
async function isDateBlocked(supabase, date) {
  const { data } = await supabase
    .from("availability")
    .select("is_available")
    .eq("date", date)
    .single();
  // No record = open. Record with is_available=false = blocked.
  return data !== null && data.is_available === false;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");

    const supabase = getSupabaseAdmin();

    // --- Per-date slot availability ---
    if (date) {
      if (!DATE_RE.test(date)) {
        return NextResponse.json({ error: "Formato de fecha: YYYY-MM-DD" }, { status: 400 });
      }

      const blocked = await isDateBlocked(supabase, date);
      if (blocked) {
        return NextResponse.json({ slots: [] });
      }

      const { data: bookings } = await supabase
        .from("bookings")
        .select("time_slot")
        .eq("date", date)
        .in("status", ["pending", "confirmed"]);

      const counts = {};
      (bookings || []).forEach((row) => {
        counts[row.time_slot] = (counts[row.time_slot] || 0) + 1;
      });

      const slots = ALL_SLOTS.filter((s) => (counts[s] || 0) < MAX_PER_SLOT);
      return NextResponse.json({ slots });
    }

    // --- Month availability (which dates have at least one open slot) ---
    if (month) {
      if (!MONTH_RE.test(month)) {
        return NextResponse.json({ error: "Formato de mes: YYYY-MM" }, { status: 400 });
      }

      const [year, m] = month.split("-").map(Number);
      const lastDay = new Date(year, m, 0).getDate();

      // Build all dates in the month
      const allDates = [];
      for (let d = 1; d <= lastDay; d++) {
        allDates.push(`${month}-${String(d).padStart(2, "0")}`);
      }

      const startDate = `${month}-01`;
      const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

      // Fetch blocked dates for this month
      const { data: blockedRows } = await supabase
        .from("availability")
        .select("date, is_available")
        .gte("date", startDate)
        .lte("date", endDate)
        .eq("is_available", false);

      const blockedSet = new Set((blockedRows || []).map((r) => r.date));
      const enabledDates = allDates.filter((d) => !blockedSet.has(d));

      if (enabledDates.length === 0) {
        return NextResponse.json({ dates: [] });
      }

      // For each enabled date, check if there's still capacity in at least one slot
      const { data: bookings } = await supabase
        .from("bookings")
        .select("date, time_slot")
        .in("date", enabledDates)
        .in("status", ["pending", "confirmed"]);

      const slotCounts = {};
      (bookings || []).forEach((row) => {
        const key = `${row.date}::${row.time_slot}`;
        slotCounts[key] = (slotCounts[key] || 0) + 1;
      });

      // A date is available if at least one slot still has capacity
      const availableDates = enabledDates.filter((d) => {
        return ALL_SLOTS.some((s) => (slotCounts[`${d}::${s}`] || 0) < MAX_PER_SLOT);
      });

      return NextResponse.json({ dates: availableDates });
    }

    return NextResponse.json(
      { error: "Parámetro requerido: date=YYYY-MM-DD o month=YYYY-MM" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
