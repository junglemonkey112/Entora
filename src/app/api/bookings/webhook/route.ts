import { NextResponse } from "next/server";

// Stripe webhook — not yet configured.
// Add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to enable.
export async function POST() {
  return NextResponse.json(
    { error: "Stripe payments not yet configured" },
    { status: 503 }
  );
}
