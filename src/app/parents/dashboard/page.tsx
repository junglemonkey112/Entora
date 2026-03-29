import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Map, CalendarDays, CheckCircle2, Clock, Star, ArrowRight,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default async function ParentDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify this user is a parent
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "parent") redirect("/");

  // Find child profile by parent's linked email (MVP: match by email in user_metadata or same domain)
  // For MVP, we show what we can fetch for the parent themselves, and also show a "link your child" prompt
  const childEmail: string | null = (user.user_metadata?.child_email as string | undefined) ?? null;

  let childProfile: { id: string; full_name: string; email: string } | null = null;
  let completedMilestones: { milestone_id: string }[] = [];
  let totalMilestones = 0;
  let upcomingBookings: Array<{
    id: string;
    scheduled_at: string;
    topic: string | null;
    guide: { slug: string; profile: { full_name: string } | null } | null;
  }> = [];

  if (childEmail) {
    const { data: child } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("email", childEmail)
      .single();

    if (child) {
      childProfile = child;

      // Milestone progress
      const [{ data: completed }, { count }] = await Promise.all([
        supabase
          .from("user_milestones")
          .select("milestone_id")
          .eq("user_id", child.id),
        supabase
          .from("roadmap_milestones")
          .select("*", { count: "exact", head: true })
          .is("country_variant", null),
      ]);
      completedMilestones = completed ?? [];
      totalMilestones = count ?? 0;

      // Upcoming sessions
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id, scheduled_at, topic,
          guide:guide_profiles!guide_id(slug, profile:profiles!user_id(full_name))
        `)
        .eq("student_id", child.id)
        .eq("status", "confirmed")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at")
        .limit(5);

      upcomingBookings = (bookings ?? []) as typeof upcomingBookings;
    }
  }

  const progressPct = totalMilestones > 0
    ? Math.round((completedMilestones.length / totalMilestones) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Parent Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {profile.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}.` : "Welcome back."}{" "}
          Track your child&apos;s college prep progress.
        </p>
      </div>

      {!childEmail ? (
        // Prompt to link child account
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
          <Map className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Link your child&apos;s account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            To see roadmap progress and upcoming sessions, enter your child&apos;s
            Entora email address.
          </p>
          <form
            method="POST"
            action="/api/parents/link-child"
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              name="child_email"
              placeholder="child@example.com"
              required
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Link
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Child info + progress */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Map className="h-5 w-5 text-indigo-600" />
                  Roadmap Progress
                </h2>
                {childProfile && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {childProfile.full_name}
                  </p>
                )}
              </div>
              <Link
                href="/roadmap"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Full roadmap <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400">
                  {completedMilestones.length} of {totalMilestones} milestones completed
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {progressPct}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-2.5 rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {completedMilestones.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                No milestones completed yet — encourage your child to check the roadmap!
              </p>
            )}
          </div>

          {/* Upcoming sessions */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                Upcoming Sessions
              </h2>
              <Link
                href="/guides"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Browse counselors <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 dark:text-gray-600 mb-3">
                  No upcoming sessions booked.
                </p>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Book a session with a Student Counselor <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => {
                  const guideName = (booking.guide?.profile as { full_name: string } | null)?.full_name ?? "Counselor";
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-neutral-900">
                      <div className="h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-sm font-semibold text-teal-700 dark:text-teal-300 shrink-0">
                        {guideName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {guideName}
                        </p>
                        {booking.topic && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {booking.topic}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {format(new Date(booking.scheduled_at), "MMM d")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(booking.scheduled_at), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/roadmap", icon: Map, label: "View Roadmap", color: "text-indigo-600" },
              { href: "/guides", icon: Star, label: "Find Counselors", color: "text-amber-600" },
              { href: "/community", icon: CheckCircle2, label: "Community Forum", color: "text-teal-600" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-neutral-950 transition-all hover:shadow-sm"
              >
                <item.icon className={`h-5 w-5 ${item.color} shrink-0`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
