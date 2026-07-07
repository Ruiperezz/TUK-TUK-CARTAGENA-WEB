import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

// Fleet size and tour durations in hours (each slot = 1 hour)
const FLEET_SIZE = 3;
const TOUR_DURATION_SLOTS = { city: 2, bay: 2, myway: 1 };

// How many tuk-tuks are physically out at a given slot index
// A booking at slot B for a tour of D slots occupies slots B, B+1, ..., B+D-1
function countBusyAtIndex(bookings, slotIndex) {
  let count = 0;
  for (const b of bookings) {
    const bIndex = ALL_SLOTS.indexOf(b.time_slot);
    if (bIndex === -1) continue;
    const duration = TOUR_DURATION_SLOTS[b.tour] ?? 1;
    if (slotIndex >= bIndex && slotIndex < bIndex + duration) {
      count += Math.ceil((b.adults || 1) / 4);
    }
  }
  return count;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

async function isDateBlocked(supabase, date) {
  const { data } = await supabase
    .from("availability")
    .select("is_available")
    .eq("date", date)
    .single();
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
      if (blocked) return NextResponse.json({ slots: [] });

      const { data: bookings } = await supabase
        .from("bookings")
        .select("time_slot, tour, adults")
        .eq("date", date)
        .in("status", ["pending", "confirmed"]);

      // A slot is available if at least one tuk-tuk is free at that start time
      const slots = ALL_SLOTS.filter((s, i) => countBusyAtIndex(bookings || [], i) < FLEET_SIZE);
      return NextResponse.json({ slots });
    }

    // --- Month availability (which dates have at least one open slot) ---
    if (month) {
      if (!MONTH_RE.test(month)) {
        return NextResponse.json({ error: "Formato de mes: YYYY-MM" }, { status: 400 });
      }

      const [year, m] = month.split("-").map(Number);
      const lastDay = new Date(year, m, 0).getDate();

      const allDates = [];
      for (let d = 1; d <= lastDay; d++) {
        allDates.push(`${month}-${String(d).padStart(2, "0")}`);
      }

      const startDate = `${month}-01`;
      const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

      // Fetch blocked dates
      const { data: blockedRows } = await supabase
        .from("availability")
        .select("date")
        .gte("date", startDate)
        .lte("date", endDate)
        .eq("is_available", false);

      const blockedSet = new Set((blockedRows || []).map((r) => r.date));
      const enabledDates = allDates.filter((d) => !blockedSet.has(d));

      if (enabledDates.length === 0) return NextResponse.json({ dates: [] });

      // Fetch all bookings for enabled dates in bulk
      const { data: bookings } = await supabase
        .from("bookings")
        .select("date, time_slot, tour, adults")
        .in("date", enabledDates)
        .in("status", ["pending", "confirmed"]);

      // Group bookings by date
      const byDate = {};
      for (const b of bookings || []) {
        if (!byDate[b.date]) byDate[b.date] = [];
        byDate[b.date].push(b);
      }

      // A date is available if at least one slot has a free tuk-tuk
      const availableDates = enabledDates.filter((d) => {
        const dayBookings = byDate[d] || [];
        return ALL_SLOTS.some((_, i) => countBusyAtIndex(dayBookings, i) < FLEET_SIZE);
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
