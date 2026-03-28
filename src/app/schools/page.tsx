import { createClient } from "@/lib/supabase/server";
import SchoolExplorer from "./SchoolExplorer";

export default async function SchoolsPage() {
  const supabase = await createClient();

  const { data: universities } = await supabase
    .from("universities")
    .select("*")
    .order("ranking", { ascending: true, nullsFirst: false });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          School Explorer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Search and compare universities by acceptance rate, cost, location, and
          programs. Each school page shows community threads and guides who
          attend.
        </p>
      </div>

      <SchoolExplorer universities={universities ?? []} />
    </div>
  );
}
