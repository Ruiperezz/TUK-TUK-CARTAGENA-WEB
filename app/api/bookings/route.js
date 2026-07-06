import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";
import { getStripe } from "../../../src/lib/stripe";

const VALID_TOURS = ["city", "bay", "myway"];
const VALID_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];
const VALID_LANGS = ["es", "en", "de", "fr"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_SLOT = 2;
const PRICE = 120;

const TOUR_NAMES = {
  city: "Cartagena City (90 min)",
  bay: "Cartagena Bay (90 min)",
  myway: "Cartagena My Way (60 min)",
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { tour, date, time, people, name, email, lang } = body;

    // --- Input validation ---
    if (!tour || !VALID_TOURS.includes(tour)) {
      return NextResponse.json({ error: "Tour no válido" }, { status: 400 });
    }
    if (!date || !DATE_RE.test(date)) {
      return NextResponse.json({ error: "Fecha no válida (YYYY-MM-DD)" }, { status: 400 });
    }
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(dateObj.getTime()) || dateObj < today) {
      return NextResponse.json({ error: "La fecha debe ser hoy o posterior" }, { status: 400 });
    }
    if (!time || !VALID_SLOTS.includes(time)) {
      return NextResponse.json({ error: "Horario no válido" }, { status: 400 });
    }
    const peopleInt = parseInt(people, 10);
    if (!Number.isInteger(peopleInt) || peopleInt < 1 || peopleInt > 4) {
      return NextResponse.json({ error: "Número de personas no válido (1-4)" }, { status: 400 });
    }
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // --- Check date is not blocked by admin ---
    const { data: avail } = await supabase
      .from("availability")
      .select("is_available")
      .eq("date", date)
      .single();

    // No record = open by default. Only blocked if is_available === false.
    if (avail !== null && avail.is_available === false) {
      return NextResponse.json({ error: "Fecha no disponible" }, { status: 400 });
    }

    // --- Check slot capacity (max 2 per hour) ---
    const { data: slotBookings, error: slotErr } = await supabase
      .from("bookings")
      .select("id")
      .eq("date", date)
      .eq("time_slot", time)
      .in("status", ["pending", "confirmed"]);

    if (slotErr) {
      return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 });
    }
    if ((slotBookings || []).length >= MAX_PER_SLOT) {
      return NextResponse.json({ error: "Este horario está completo. Por favor elige otro." }, { status: 400 });
    }

    const customerLang = VALID_LANGS.includes(lang) ? lang : "es";

    // --- Create booking ---
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert({
        tour,
        date,
        time_slot: time,
        adults: peopleInt,
        kids: 0,
        is_private: true,
        total_price: PRICE,
        customer_name: name.trim(),
        customer_email: email.toLowerCase().trim(),
        customer_lang: customerLang,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: "Error al crear reserva" }, { status: 500 });
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tuktukcartagena.com";

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: TOUR_NAMES[tour],
                description: `${peopleInt} persona${peopleInt > 1 ? "s" : ""} · ${date} · ${time}`,
              },
              unit_amount: PRICE * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${siteUrl}?booking=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}?booking=cancelled`,
        customer_email: email.toLowerCase().trim(),
        metadata: { booking_id: booking.id },
      });
    } catch (stripeErr) {
      // Clean up orphan booking if Stripe session creation fails
      await supabase.from("bookings").delete().eq("id", booking.id);
      console.error("Stripe error:", stripeErr);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }

    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
