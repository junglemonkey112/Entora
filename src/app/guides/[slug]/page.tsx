import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, Star, MapPin, Globe, CalendarDays, MessageSquare
} from "lucide-react";
import Badge from "@/components/ui/Badge";

const specialtyLabels: Record<string, string> = {
  essays: "Essays",
  "us-applications": "US Applications",
  "uk-applications": "UK Applications",
  "financial-aid": "Financial Aid",
  "test-prep": "Test Prep",
  international: "International Students",
};

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: guide } = await supabase
    .from("guide_profiles")
    .select(`
      *,
      profile:profiles!user_id(full_name, country, avatar_url, email)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!guide) notFound();

  const { data: reviews } = await supabase
    .from("guide_reviews")
    .select(`
      *,
      student:profiles!student_id(full_name, country)
    `)
    .eq("guide_id", guide.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const name = (guide.profile as { full_name: string } | null)?.full_name ?? guide.slug;
  const country = guide.country ?? (guide.profile as { country: string } | null)?.country;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Student Counselors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left column: profile + bio ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header card */}
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {name}
                </h1>
                {guide.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              {country && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {country}
                </p>
              )}
              {guide.languages && (guide.languages as string[]).length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {(guide.languages as string[]).join(" · ")}
                </p>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {guide.rating > 0
                  ? <span className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      {Number(guide.rating).toFixed(2)}
                    </span>
                  : "—"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {guide.review_count > 0 ? `${guide.review_count} reviews` : "No reviews yet"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {guide.sessions_count ?? 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Sessions completed
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {guide.hourly_rate ? `$${guide.hourly_rate}` : "Free"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Per hour
              </p>
            </div>
          </div>

          {/* About */}
          {guide.bio && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {guide.bio}
              </p>
            </section>
          )}

          {/* Specialties */}
          {guide.specialties && (guide.specialties as string[]).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {(guide.specialties as string[]).map((s: string) => (
                  <Badge key={s} variant="secondary">
                    {specialtyLabels[s] ?? s}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Schools */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Schools</h2>
            {guide.universities_attended && (guide.universities_attended as string[]).length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Currently attends / attended
                </p>
                <div className="flex flex-wrap gap-2">
                  {(guide.universities_attended as string[]).map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {guide.also_accepted_to && (guide.also_accepted_to as string[]).length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Also accepted to
                </p>
                <div className="flex flex-wrap gap-2">
                  {(guide.also_accepted_to as string[]).map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reviews {reviews && reviews.length > 0 && `(${reviews.length})`}
            </h2>
            {!reviews || reviews.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4">
                No reviews yet — be the first to book a session!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => {
                  const student = r.student as { full_name: string; country: string } | null;
                  return (
                    <div key={r.id} className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i <= r.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {student?.full_name ?? "Student"}
                        </span>
                        {student?.country && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            from {student.country}
                          </span>
                        )}
                      </div>
                      {r.comment && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ── Right column: sticky booking card ─────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6 shadow-sm">
            <div className="text-center mb-5">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-0.5">
                {guide.hourly_rate ? `$${guide.hourly_rate}` : "Free"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">per 60-min session</p>
            </div>

            {guide.rating > 0 && (
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= Math.round(Number(guide.rating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Number(guide.rating).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  ({guide.review_count} reviews)
                </span>
              </div>
            )}

            <Link
              href={`/guides/${guide.slug}/book`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors mb-3"
            >
              <CalendarDays className="h-4 w-4" />
              Book a session
            </Link>

            <Link
              href="/community"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Message in Community
            </Link>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              Sessions are 60 minutes via video call. You can cancel up to 24 hours before.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
