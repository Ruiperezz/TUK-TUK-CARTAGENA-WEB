import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../src/lib/supabase";
import { getStripe } from "../../../src/lib/stripe";

const VALID_TOURS = ["city", "bay", "myway"];
const VALID_TIMES = ["morning", "afternoon"];
const VALID_LANGS = ["es", "en", "de", "fr"];

const TOUR_NAMES = {
  city: "Cartagena City (90 min)",
  bay: "Cartagena Bay (90 min)",
  myway: "Cartagena My Way (60 min)",
};

function calculatePrice(adults, kids, isPrivate) {
  const total = adults + kids;
  if (total > 4) {
    // Split: private tuk tuk (4 pax, 120€) + shared pricing for remainder
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

    if (!tour || !VALID_TOURS.includes(tour)) {
      return NextResponse.json({ error: "Tour no válido" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
    }
    if (!time || !VALID_TIMES.includes(time)) {
      return NextResponse.json({ error: "Horario no válido" }, { status: 400 });
    }
    if (!adults || adults < 1) {
      return NextResponse.json({ error: "Mínimo 1 adulto" }, { status: 400 });
    }
    if (adults + (kids || 0) > 8) {
      return NextResponse.json(
        { error: "Máximo 8 pasajeros por reserva (2 tuk tuks)" },
        { status: 400 }
      );
    }
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email requeridos" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: avail } = await supabase
      .from("availability")
      .select("is_available")
      .eq("date", date)
      .single();

    if (!avail || !avail.is_available) {
      return NextResponse.json(
        { error: "Fecha no disponible" },
        { status: 400 }
      );
    }

    const totalPrice = calculatePrice(adults, kids || 0, isPrivate);
    const customerLang = VALID_LANGS.includes(lang) ? lang : "es";

    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert({
        tour,
        date,
        time_slot: time,
        adults,
        kids: kids || 0,
        is_private: isPrivate || false,
        total_price: totalPrice,
        customer_name: name,
        customer_email: email,
        customer_lang: customerLang,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "Error al crear reserva" },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tuktukcartagena.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: TOUR_NAMES[tour],
              description: adults + (kids || 0) > 4
                ? `Tuk tuk privado (4 pax) + ${adults + (kids || 0) - 4} en compartido · ${date}`
                : isPrivate
                ? `Tuk tuk privado · ${date}`
                : `${adults} adulto(s)${kids ? ` + ${kids} niño(s)` : ""} · ${date}`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}?booking=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}?booking=cancelled`,
      customer_email: email,
      metadata: {
        booking_id: booking.id,
      },
    });

    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
