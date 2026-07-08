import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId || typeof sessionId !== "string" || sessionId.length > 200) {
    return NextResponse.json({ error: "session_id requerido" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("tour, date, time_slot, adults, total_price, status")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
