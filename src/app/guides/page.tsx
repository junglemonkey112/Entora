import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GraduationCap, Star, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import GuideFilters from "./GuideFilters";

const specialtyLabels: Record<string, string> = {
  essays: "Essays",
  "us-applications": "US Apps",
  "uk-applications": "UK Apps",
  "financial-aid": "Financial Aid",
  "test-prep": "Test Prep",
  international: "International",
};

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{
    specialty?: string;
    country?: string;
    language?: string;
    maxPrice?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("guide_profiles")
    .select(`
      *,
      profile:profiles!user_id(full_name, country, avatar_url)
    `)
    .eq("is_active", true)
    .order("sessions_count", { ascending: false });

  if (params.specialty) {
    query = query.contains("specialties", [params.specialty]);
  }
  if (params.country) {
    query = query.eq("country", params.country);
  }
  if (params.language) {
    query = query.contains("languages", [params.language]);
  }
  if (params.maxPrice) {
    query = query.lte("hourly_rate", parseInt(params.maxPrice, 10));
  }

  const { data: guides } = await query;

  const hasFilters = !!(params.specialty || params.country || params.language || params.maxPrice);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 mb-4">
          <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Find a Student Counselor
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Get guidance from students who have successfully navigated the exact same admissions process
          you&apos;re going through now.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-800">
        <GuideFilters />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {guides?.length ?? 0} counselor{(guides?.length ?? 0) !== 1 ? "s" : ""}
          {hasFilters ? " matching your filters" : " available"}
        </p>
        {hasFilters && (
          <Link
            href="/guides"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear filters
          </Link>
        )}
      </div>

      {/* Guide cards */}
      {!guides || guides.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No counselors match your current filters.
          </p>
          <Link href="/guides" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {guides.map((g) => {
            const name = (g.profile as { full_name: string } | null)?.full_name ?? g.slug;
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Link
                key={g.id}
                href={`/guides/${g.slug}`}
                className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
              >
                {/* Avatar + name + verified */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-base font-semibold text-indigo-700 dark:text-indigo-300 shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {name}
                      </p>
                      {g.is_verified && (
                        <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      )}
                    </div>
                    {g.country && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {g.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* University */}
                {g.universities_attended && (g.universities_attended as string[]).length > 0 && (
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {(g.universities_attended as string[])[0]}
                  </p>
                )}

                {/* Also accepted to */}
                {g.also_accepted_to && (g.also_accepted_to as string[]).length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Also accepted: {(g.also_accepted_to as string[]).slice(0, 3).join(", ")}
                    {(g.also_accepted_to as string[]).length > 3 && ` +${(g.also_accepted_to as string[]).length - 3}`}
                  </p>
                )}

                {/* Specialties */}
                {g.specialties && (g.specialties as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(g.specialties as string[]).slice(0, 4).map((s: string) => (
                      <Badge key={s} variant="secondary">
                        {specialtyLabels[s] ?? s}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Rating + price */}
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {g.rating > 0 ? Number(g.rating).toFixed(2) : "New"}
                    </span>
                    {g.review_count > 0 && (
                      <span className="text-gray-400 dark:text-gray-500">
                        ({g.review_count})
                      </span>
                    )}
                  </div>
                  {g.hourly_rate && (
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      ${g.hourly_rate}/hr
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Are you a guide? CTA */}
      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Are you a university student?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-lg mx-auto">
          Share your experience and help future applicants navigate the process you&apos;ve been through.
          Become a verified Student Counselor on Entora.
        </p>
        <Link
          href="/become-counselor"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Become a Student Counselor
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
