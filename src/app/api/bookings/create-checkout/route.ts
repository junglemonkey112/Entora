import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let guideId: string;
  let scheduledAt: string;
  let topic: string | null;

  try {
    ({ guideId, scheduledAt, topic } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Fetch guide to get hourly_rate
  const { data: guide } = await supabase
    .from("guide_profiles")
    .select("id, hourly_rate, slug")
    .eq("id", guideId)
    .eq("is_active", true)
    .single();

  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey || !guide.hourly_rate) {
    // No Stripe configured or free guide — create booking directly as confirmed
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        student_id: user.id,
        guide_id: guideId,
        scheduled_at: scheduledAt,
        topic: topic ?? null,
        status: "confirmed",
        amount_cents: guide.hourly_rate ? guide.hourly_rate * 100 : 0,
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ bookingId: booking!.id });
  }

  // Stripe path
  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(stripeKey);

    // Create pending booking first
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        student_id: user.id,
        guide_id: guideId,
        scheduled_at: scheduledAt,
        topic: topic ?? null,
        status: "pending",
        amount_cents: guide.hourly_rate * 100,
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `60-min session with ${guide.slug}`,
            },
            unit_amount: guide.hourly_rate * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/guides/${guide.slug}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/guides/${guide.slug}/book`,
      metadata: {
        booking_id: booking!.id,
      },
    });

    // Store stripe session id
    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking!.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
