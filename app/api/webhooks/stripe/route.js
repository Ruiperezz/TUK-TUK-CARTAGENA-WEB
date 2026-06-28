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
    const bookingId = session.metadata?.booking_id;

    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId)
      .select()
      .single();

    if (fetchError || !booking) {
      console.error("Error updating booking:", fetchError);
      return NextResponse.json({ received: true });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.BUSINESS_EMAIL || "info@tuktukcartagena.com";

      await resend.emails.send({
        from: `TUK TUK Cartagena <${fromEmail}>`,
        to: booking.customer_email,
        subject: getCustomerEmailSubject(booking.customer_lang),
        html: getCustomerEmailHtml(booking),
      });

      await resend.emails.send({
        from: `TUK TUK Cartagena <${fromEmail}>`,
        to: fromEmail,
        subject: getOwnerEmailSubject(booking),
        html: getOwnerEmailHtml(booking),
      });
    } catch (emailErr) {
      console.error("Error sending emails:", emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
