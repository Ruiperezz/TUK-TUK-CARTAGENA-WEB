import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";

// Called daily by Vercel Cron to prevent Supabase free-tier auto-pause (7-day inactivity limit).
// Vercel automatically sends Authorization: Bearer <CRON_SECRET> for cron invocations.
export async function GET(request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("bookings")
      .select("id")
      .limit(1);

    if (error) {
      console.error("[keep-alive] DB error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    console.log("[keep-alive] Supabase ping OK —", new Date().toISOString());
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[keep-alive] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
