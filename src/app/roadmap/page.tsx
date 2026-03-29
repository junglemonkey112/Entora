import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import RoadmapTimeline from "./RoadmapTimeline";

export default async function RoadmapPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Resolve the user's country from their profile
  let userCountry: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("country")
      .eq("id", user.id)
      .single();
    userCountry = profile?.country ?? (user.user_metadata?.country as string | undefined) ?? null;
  }

  // Normalise to the lowercase variant used in country_variant column
  const countryVariant = userCountry?.toLowerCase() ?? null;

  // Fetch milestones: universal ones (country_variant IS NULL) + country-specific ones
  let milestonesQuery = supabase
    .from("roadmap_milestones")
    .select("*")
    .order("grade")
    .order("sort_order");

  if (countryVariant) {
    milestonesQuery = milestonesQuery.or(
      `country_variant.is.null,country_variant.eq.${countryVariant}`
    );
  } else {
    milestonesQuery = milestonesQuery.is("country_variant", null);
  }

  const { data: milestones } = await milestonesQuery;

  let completedIds: string[] = [];
  if (user) {
    const { data } = await supabase
      .from("user_milestones")
      .select("milestone_id")
      .eq("user_id", user.id);
    completedIds = data?.map((d) => d.milestone_id) ?? [];
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Grade-by-Grade Roadmap
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Interactive timeline from grade 9 through 12. Know exactly what to do
          and when — localized for US, UK, Canada, and Australia.
        </p>
      </div>

      {/* Personalisation banner */}
      {userCountry ? (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 px-4 py-3">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Showing roadmap tailored for students from{" "}
            <span className="font-semibold">{userCountry}</span>, including
            visa, language test, and scholarship milestones.
          </p>
          <Link
            href="/settings"
            className="shrink-0 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Change
          </Link>
        </div>
      ) : user ? (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set your country to see personalised milestones (visa timelines,
            language tests, scholarships).
          </p>
          <Link
            href="/settings"
            className="shrink-0 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Set country
          </Link>
        </div>
      ) : null}

      <RoadmapTimeline
        milestones={milestones ?? []}
        completedIds={completedIds}
        isLoggedIn={!!user}
      />
    </div>
  );
}
