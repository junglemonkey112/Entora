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

  const { data: guide } = await supabase
    .from("guide_profiles")
    .select("id, hourly_rate, slug")
    .eq("id", guideId)
    .eq("is_active", true)
    .single();

  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

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
