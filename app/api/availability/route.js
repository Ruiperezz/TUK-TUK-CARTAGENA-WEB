import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";

export const dynamic = "force-dynamic";

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

const FLEET_SIZE = 3;
const TOUR_DURATION_SLOTS = { city: 1, bay: 1 };
const PENDING_HOLD_MINUTES = 30;

function isActiveBooking(b) {
  if (b.status === "confirmed") return true;
  const ageMs = Date.now() - new Date(b.created_at).getTime();
  return ageMs < PENDING_HOLD_MINUTES * 60_000;
}

// Tuk tuks physically out at a given slot index (from confirmed/pending bookings)
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const supabase = getSupabaseAdmin();

    // ── Per-date: slots + how many tuk tuks are free per slot ───────────────
    if (date) {
      if (!DATE_RE.test(date))
        return NextResponse.json({ error: "Formato de fecha: YYYY-MM-DD" }, { status: 400 });

      // Day-level admin block
      const { data: dayBlock } = await supabase
        .from("availability")
        .select("is_available, blocked_tuktuks")
        .eq("date", date)
        .single();

      const dayBlockedCount = dayBlock?.is_available === false ? (dayBlock.blocked_tuktuks ?? 3) : 0;

      // If whole fleet is blocked for the day → nothing available
      if (dayBlockedCount >= FLEET_SIZE)
        return NextResponse.json({ slots: [], slot_capacity: {} });

      // Slot-level admin blocks
      const { data: slotBlockRows } = await supabase
        .from("blocked_slots")
        .select("time_slot, blocked_tuktuks")
        .eq("date", date);

      const slotBlockMap = {};
      for (const r of (slotBlockRows || [])) {
        slotBlockMap[r.time_slot] = r.blocked_tuktuks ?? 3;
      }

      // Active bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("time_slot, tour, adults, status, created_at")
        .eq("date", date)
        .in("status", ["pending", "confirmed"]);

      const activeBookings = (bookings || []).filter(isActiveBooking);

      const slots = [];
      const slot_capacity = {};

      for (let i = 0; i < ALL_SLOTS.length; i++) {
        const s = ALL_SLOTS[i];
        const slotBlocked = slotBlockMap[s] ?? 0;
        const effectiveCap = Math.max(0, FLEET_SIZE - dayBlockedCount - slotBlocked);
        const busy = countBusyAtIndex(activeBookings, i);
        const free = Math.max(0, effectiveCap - busy);
        slot_capacity[s] = free;
        if (free > 0) slots.push(s);
      }

      return NextResponse.json({ slots, slot_capacity });
    }

    // ── Per-month: which dates have at least one open slot ──────────────────
    if (month) {
      if (!MONTH_RE.test(month))
        return NextResponse.json({ error: "Formato de mes: YYYY-MM" }, { status: 400 });

      const [year, m] = month.split("-").map(Number);
      const lastDay = new Date(year, m, 0).getDate();
      const allDates = [];
      for (let d = 1; d <= lastDay; d++)
        allDates.push(`${month}-${String(d).padStart(2, "0")}`);

      const startDate = `${month}-01`;
      const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

      // Day-level blocks
      const { data: dayBlocks } = await supabase
        .from("availability")
        .select("date, is_available, blocked_tuktuks")
        .gte("date", startDate)
        .lte("date", endDate);

      const dayBlockMap = {};
      for (const r of (dayBlocks || [])) {
        if (r.is_available === false)
          dayBlockMap[r.date] = r.blocked_tuktuks ?? 3;
      }

      // Dates where the full fleet is blocked → exclude
      const enabledDates = allDates.filter((d) => (dayBlockMap[d] ?? 0) < FLEET_SIZE);
      if (enabledDates.length === 0) return NextResponse.json({ dates: [] });

      // Slot-level blocks for enabled dates
      const { data: slotBlockRows } = await supabase
        .from("blocked_slots")
        .select("date, time_slot, blocked_tuktuks")
        .in("date", enabledDates);

      const slotBlockByDate = {};
      for (const r of (slotBlockRows || [])) {
        if (!slotBlockByDate[r.date]) slotBlockByDate[r.date] = {};
        slotBlockByDate[r.date][r.time_slot] = r.blocked_tuktuks ?? 3;
      }

      // Bookings for enabled dates
      const { data: bookings } = await supabase
        .from("bookings")
        .select("date, time_slot, tour, adults, status, created_at")
        .in("date", enabledDates)
        .in("status", ["pending", "confirmed"]);

      const byDate = {};
      for (const b of (bookings || []).filter(isActiveBooking)) {
        if (!byDate[b.date]) byDate[b.date] = [];
        byDate[b.date].push(b);
      }

      const availableDates = enabledDates.filter((d) => {
        const dayBlocked = dayBlockMap[d] ?? 0;
        const slotBlocks = slotBlockByDate[d] ?? {};
        const dayBookings = byDate[d] || [];
        return ALL_SLOTS.some((s, i) => {
          const slotBlocked = slotBlocks[s] ?? 0;
          const effectiveCap = Math.max(0, FLEET_SIZE - dayBlocked - slotBlocked);
          return effectiveCap > 0 && countBusyAtIndex(dayBookings, i) < effectiveCap;
        });
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
