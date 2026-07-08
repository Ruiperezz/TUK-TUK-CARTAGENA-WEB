import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "../../../../src/lib/stripe";
import { getSupabaseAdmin } from "../../../../src/lib/supabase";
import { Resend } from "resend";
import {
  getCustomerEmailSubject,
  getCustomerEmailHtml,
} from "../../../../src/lib/emails/booking-customer";
import {
  getOwnerEmailSubject,
  getOwnerEmailHtml,
} from "../../../../src/lib/emails/booking-owner";

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  const stripe = getStripe();
  let event;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Firma no válida" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Only process fully paid sessions
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const bookingId = session.metadata?.booking_id;

    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();

    // Atomic idempotency: only update rows still in "pending" to avoid
    // sending duplicate emails when Stripe delivers the same event twice.
    const { data: booking, error: fetchError, count } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId)
      .eq("status", "pending")
      .select()
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = 0 rows matched (already confirmed) — not an error
      console.error("Error updating booking:", fetchError);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // If no row was updated, booking was already confirmed — skip emails
    if (!booking) {
      return NextResponse.json({ received: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.BUSINESS_EMAIL || "reservas@tuktukcartagena.com";

    const [customerResult, ownerResult] = await Promise.allSettled([
      resend.emails.send({
        from: `TUK TUK Cartagena <noreply@tuktukcartagena.com>`,
        to: booking.customer_email,
        subject: getCustomerEmailSubject(booking.customer_lang),
        html: getCustomerEmailHtml(booking),
      }),
      resend.emails.send({
        from: `TUK TUK Cartagena <noreply@tuktukcartagena.com>`,
        to: fromEmail,
        subject: getOwnerEmailSubject(booking),
        html: getOwnerEmailHtml(booking),
      }),
    ]);

    if (customerResult.status === "rejected") {
      console.error("Error sending customer email:", customerResult.reason);
    }
    if (ownerResult.status === "rejected") {
      console.error("Error sending owner email:", ownerResult.reason);
    }
  }

  // Clean up abandoned Stripe sessions so fleet capacity is not blocked
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const bookingId = session.metadata?.booking_id;
    if (bookingId) {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("bookings")
        .update({ status: "abandoned" })
        .eq("id", bookingId)
        .eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
