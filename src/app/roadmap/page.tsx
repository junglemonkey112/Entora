import { createClient } from "@/lib/supabase/server";
import RoadmapTimeline from "./RoadmapTimeline";

export default async function RoadmapPage() {
  const supabase = await createClient();

  const { data: milestones } = await supabase
    .from("roadmap_milestones")
    .select("*")
    .order("grade")
    .order("sort_order");

  // Check if user is logged in and fetch their completed milestones
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          and when — localized for US, UK, India, and Nigeria.
        </p>
      </div>

      <RoadmapTimeline
        milestones={milestones ?? []}
        completedIds={completedIds}
        isLoggedIn={!!user}
      />
    </div>
  );
}
