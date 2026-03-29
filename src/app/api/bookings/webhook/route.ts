import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };

  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(stripeKey);
    event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret) as typeof event;
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; metadata?: { booking_id?: string } };
    const bookingId = session.metadata?.booking_id;

    if (bookingId) {
      const supabase = await createClient();
      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);
    }
  }

  return NextResponse.json({ received: true });
}
