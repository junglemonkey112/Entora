import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, CalendarDays, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

interface BookingRow {
  id: string;
  scheduled_at: string;
  topic: string | null;
  guide: { slug: string; profile: { full_name: string } | null } | null;
}

export default async function BookSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ booking_id?: string; session_id?: string }>;
}) {
  const { slug } = await params;
  const { booking_id, session_id } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const SELECT = "id, scheduled_at, topic, guide:guide_profiles!guide_id(slug, profile:profiles!user_id(full_name))";
  let booking: BookingRow | null = null;

  if (booking_id) {
    const { data } = await supabase
      .from("bookings")
      .select(SELECT)
      .eq("id", booking_id)
      .eq("student_id", user.id)
      .single();
    booking = (data ?? null) as BookingRow | null;
  } else if (session_id) {
    const { data } = await supabase
      .from("bookings")
      .select(SELECT)
      .eq("stripe_session_id", session_id)
      .eq("student_id", user.id)
      .single();
    booking = (data ?? null) as BookingRow | null;
  }

  const guideData = booking?.guide as { slug: string; profile: { full_name: string } | null } | null;
  const guideName = guideData?.profile?.full_name ?? "your counselor";

  const scheduledAt = booking?.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const calendarLink = booking?.scheduled_at
    ? `https://calendar.google.com/calendar/r/eventedit?text=Session+with+${encodeURIComponent(guideName)}&dates=${booking.scheduled_at.replace(/[-:]/g, "").slice(0, 15)}Z/${new Date(new Date(booking.scheduled_at).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Booking confirmed!
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-2">
        Your session with{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {guideName}
        </span>{" "}
        is confirmed.
      </p>
      {scheduledAt && (
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-8">
          {scheduledAt}
        </p>
      )}
      {booking?.topic && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 italic">
          Topic: {booking.topic}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {calendarLink && (
          <a href={calendarLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </a>
        )}
        <Link href="/community">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Visit Community
          </Button>
        </Link>
        <Link href="/guides">
          <Button>Browse more counselors</Button>
        </Link>
      </div>
    </div>
  );
}
