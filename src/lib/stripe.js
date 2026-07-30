import Stripe from "stripe";

let _stripe = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim(), {
      apiVersion: "2024-06-20",
    });
  }
  return _stripe;
}
