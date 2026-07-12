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
const PRICE_PER_TUKTUK = 100;

const TOUR_NAMES = {
  city: "Cartagena City (60 min)",
  bay: "Cartagena Bay (60 min)",
  myway: "Cartagena My Way (60 min)",
};

// Stripe locale codes (ISO 639-1) for the Checkout page language
const STRIPE_LOCALE = { es: "es", en: "en", de: "de", fr: "fr" };

// Line-item description per language
const BOOKING_DESCRIPTION = {
  es: (people, date, time) => `${people} persona${people > 1 ? "s" : ""} · ${date} · ${time}`,
  en: (people, date, time) => `${people} person${people > 1 ? "s" : ""} · ${date} · ${time}`,
  de: (people, date, time) => `${people} Person${people > 1 ? "en" : ""} · ${date} · ${time}`,
  fr: (people, date, time) => `${people} personne${people > 1 ? "s" : ""} · ${date} · ${time}`,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { tour, date, time, people, tuktuks: tuktuksInput, name, email, lang } = body;

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
    if (!Number.isInteger(peopleInt) || peopleInt < 1 || peopleInt > 12) {
      return NextResponse.json({ error: "Número de personas no válido (1-12)" }, { status: 400 });
    }
    const tuktuks = Math.ceil(peopleInt / 4);
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    if (name.trim().length > 150) {
      return NextResponse.json({ error: "Nombre demasiado largo" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // --- Check date is not blocked by admin ---
    const { data: avail } = await supabase
      .from("availability")
      .select("is_available")
      .eq("date", date)
      .single();

    if (avail !== null && avail.is_available === false) {
      return NextResponse.json({ error: "Fecha no disponible" }, { status: 400 });
    }

    const customerLang = VALID_LANGS.includes(lang) ? lang : "es";

    // --- Atomic check + insert via Supabase RPC (prevents race conditions) ---
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "create_booking_atomic",
      {
        p_tour: tour,
        p_date: date,
        p_time_slot: time,
        p_adults: peopleInt,
        p_total_price: PRICE_PER_TUKTUK * tuktuks,
        p_customer_name: name.trim(),
        p_customer_email: email.toLowerCase().trim(),
        p_customer_lang: customerLang,
      }
    );

    if (rpcError) {
      console.error("RPC error:", rpcError.code, rpcError.message);
      return NextResponse.json({ error: "Error al crear reserva" }, { status: 500 });
    }

    // RPC returns { error: "..." } if capacity exceeded, or the full booking row
    if (rpcResult?.error) {
      return NextResponse.json({ error: rpcResult.error }, { status: 400 });
    }

    const booking = rpcResult;

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tuktukcartagena.com";

    let session;
    try {
      const descFn = BOOKING_DESCRIPTION[customerLang] || BOOKING_DESCRIPTION.es;
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        locale: STRIPE_LOCALE[customerLang] || "es",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: TOUR_NAMES[tour],
                description: descFn(peopleInt, date, time),
              },
              unit_amount: PRICE_PER_TUKTUK * tuktuks * 100,
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
      await supabase.from("bookings").update({ status: "abandoned" }).eq("id", booking.id);
      console.error("Stripe error:", stripeErr);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }

    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    if (updateErr) {
      // stripe_session_id not saved — orphan the booking and abort so the
      // customer doesn't reach Stripe with an untrackable session
      await supabase.from("bookings").update({ status: "abandoned" }).eq("id", booking.id);
      console.error("stripe_session_id update failed:", updateErr);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
