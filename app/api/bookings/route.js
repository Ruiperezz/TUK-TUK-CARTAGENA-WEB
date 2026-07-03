import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";
import { getStripe } from "../../../src/lib/stripe";

const VALID_TOURS = ["city", "bay", "myway"];
const VALID_TIMES = ["morning", "afternoon"];
const VALID_LANGS = ["es", "en", "de", "fr"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOUR_NAMES = {
  city: "Cartagena City (90 min)",
  bay: "Cartagena Bay (90 min)",
  myway: "Cartagena My Way (60 min)",
};

function calculatePrice(adults, kids, isPrivate) {
  const total = adults + kids;
  if (total > 4) {
    const adultsInPrivate = Math.min(adults, 4);
    const kidsInPrivate = Math.min(kids, 4 - adultsInPrivate);
    const extraAdults = adults - adultsInPrivate;
    const extraKids = kids - kidsInPrivate;
    return 120 + extraAdults * 30 + extraKids * 15;
  }
  if (isPrivate) return 120;
  return adults * 30 + kids * 15;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tour, date, time, adults, kids, isPrivate, name, email, lang } = body;

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
    if (!time || !VALID_TIMES.includes(time)) {
      return NextResponse.json({ error: "Horario no válido" }, { status: 400 });
    }
    const adultsInt = parseInt(adults, 10);
    const kidsInt = parseInt(kids ?? 0, 10);
    if (!Number.isInteger(adultsInt) || adultsInt < 1 || adultsInt !== Number(adults)) {
      return NextResponse.json({ error: "Número de adultos no válido" }, { status: 400 });
    }
    if (!Number.isInteger(kidsInt) || kidsInt < 0 || kidsInt !== Number(kids ?? 0)) {
      return NextResponse.json({ error: "Número de niños no válido" }, { status: 400 });
    }
    if (adultsInt + kidsInt > 8) {
      return NextResponse.json(
        { error: "Máximo 8 pasajeros por reserva (2 tuk tuks)" },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: avail } = await supabase
      .from("availability")
      .select("is_available")
      .eq("date", date)
      .single();

    if (!avail || !avail.is_available) {
      return NextResponse.json({ error: "Fecha no disponible" }, { status: 400 });
    }

    const totalPrice = calculatePrice(adultsInt, kidsInt, isPrivate);
    const customerLang = VALID_LANGS.includes(lang) ? lang : "es";

    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert({
        tour,
        date,
        time_slot: time,
        adults: adultsInt,
        kids: kidsInt,
        is_private: isPrivate || false,
        total_price: totalPrice,
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
        automatic_payment_methods: { enabled: true },
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: TOUR_NAMES[tour],
                description:
                  adultsInt + kidsInt > 4
                    ? `Tuk tuk privado (4 pax) + ${adultsInt + kidsInt - 4} en compartido · ${date}`
                    : isPrivate
                    ? `Tuk tuk privado · ${date}`
                    : `${adultsInt} adulto(s)${kidsInt ? ` + ${kidsInt} niño(s)` : ""} · ${date}`,
              },
              unit_amount: Math.round(totalPrice * 100),
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
