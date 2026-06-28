import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Formato de mes requerido: YYYY-MM" },
        { status: 400 }
      );
    }

    const [year, m] = month.split("-").map(Number);
    const startDate = `${month}-01`;
    const lastDay = new Date(year, m, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("availability")
      .select("date, is_available")
      .gte("date", startDate)
      .lte("date", endDate)
      .eq("is_available", true);

    if (error) {
      return NextResponse.json(
        { error: "Error al consultar disponibilidad" },
        { status: 500 }
      );
    }

    const availableDates = (data || []).map((row) => row.date);

    return NextResponse.json({ dates: availableDates });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
