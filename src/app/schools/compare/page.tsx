import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Percent, DollarSign, Trophy, MapPin, Plus, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SchoolCompareSearch from "./SchoolCompareSearch";

interface University {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  country: string | null;
  acceptance_rate: number | null;
  avg_cost: number | null;
  ranking: number | null;
  programs: string[] | null;
  website: string | null;
}

function StatCell({ value, format }: { value: number | null; format: "percent" | "currency" | "rank" | "plain" }) {
  if (value == null) return <span className="text-gray-400 dark:text-gray-600">N/A</span>;
  if (format === "percent") return <span>{value}%</span>;
  if (format === "currency") return <span>${value.toLocaleString()}</span>;
  if (format === "rank") return <span>#{value}</span>;
  return <span>{value}</span>;
}

export default async function SchoolComparePage({
  searchParams,
}: {
  searchParams: Promise<{ schools?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const slugList = params.schools
    ? params.schools.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  let schools: University[] = [];
  if (slugList.length > 0) {
    const { data } = await supabase
      .from("universities")
      .select("id, name, slug, city, state, country, acceptance_rate, avg_cost, ranking, programs, website")
      .in("slug", slugList);

    // Sort to match URL order
    const dataMap = Object.fromEntries((data ?? []).map((s) => [s.slug, s]));
    schools = slugList.map((slug) => dataMap[slug]).filter(Boolean) as University[];
  }

  // Fetch all universities for the search autocomplete
  const { data: allUniversities } = await supabase
    .from("universities")
    .select("name, slug")
    .order("name");

  const rows = [
    { label: "Location", key: "location" as const },
    { label: "Acceptance Rate", key: "acceptance_rate" as const },
    { label: "Avg Annual Cost", key: "avg_cost" as const },
    { label: "National Ranking", key: "ranking" as const },
    { label: "Programs", key: "programs" as const },
    { label: "Website", key: "website" as const },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/schools"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to schools
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Compare Schools
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Side-by-side comparison of acceptance rate, cost, ranking, and programs.
        </p>
      </div>

      {/* Search to add schools */}
      <SchoolCompareSearch
        allUniversities={allUniversities ?? []}
        currentSlugs={slugList}
      />

      {schools.length === 0 ? (
        <div className="mt-12 text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No schools selected yet.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Search for universities above to start comparing.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-36 border-b border-gray-200 dark:border-gray-800">
                  &nbsp;
                </th>
                {schools.map((school) => (
                  <th
                    key={school.slug}
                    className="p-4 border-b border-gray-200 dark:border-gray-800 min-w-[180px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                        {school.name.charAt(0)}
                      </div>
                      <Link
                        href={`/schools/${school.slug}`}
                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-center leading-tight"
                      >
                        {school.name}
                      </Link>
                      <Link
                        href={`/schools/compare?schools=${slugList.filter((s) => s !== school.slug).join(",")}`}
                        className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-0.5 mt-1"
                      >
                        <X className="h-3 w-3" /> Remove
                      </Link>
                    </div>
                  </th>
                ))}
                {schools.length < 4 && (
                  <th className="p-4 border-b border-gray-200 dark:border-gray-800 min-w-[140px]">
                    <div className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-600">
                      <div className="h-12 w-12 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-xs">Add school</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Location */}
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  Location
                </td>
                {schools.map((school) => (
                  <td key={school.slug} className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">
                    {[school.city, school.state, school.country].filter(Boolean).join(", ") || "—"}
                  </td>
                ))}
                {schools.length < 4 && <td />}
              </tr>

              {/* Acceptance Rate */}
              <tr className="border-b border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-neutral-900/40">
                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5 shrink-0" />
                  Acceptance Rate
                </td>
                {schools.map((school) => {
                  const lowest = Math.min(...schools.map((s) => s.acceptance_rate ?? Infinity));
                  const isLowest = school.acceptance_rate === lowest;
                  return (
                    <td key={school.slug} className={`p-4 text-center text-sm font-semibold ${isLowest && school.acceptance_rate != null ? "text-teal-600 dark:text-teal-400" : "text-gray-700 dark:text-gray-300"}`}>
                      <StatCell value={school.acceptance_rate} format="percent" />
                    </td>
                  );
                })}
                {schools.length < 4 && <td />}
              </tr>

              {/* Cost */}
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  Avg Annual Cost
                </td>
                {schools.map((school) => {
                  const lowest = Math.min(...schools.map((s) => s.avg_cost ?? Infinity));
                  const isLowest = school.avg_cost === lowest;
                  return (
                    <td key={school.slug} className={`p-4 text-center text-sm font-semibold ${isLowest && school.avg_cost != null ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                      <StatCell value={school.avg_cost} format="currency" />
                    </td>
                  );
                })}
                {schools.length < 4 && <td />}
              </tr>

              {/* Ranking */}
              <tr className="border-b border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-neutral-900/40">
                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 shrink-0" />
                  National Ranking
                </td>
                {schools.map((school) => {
                  const highest = Math.min(...schools.map((s) => s.ranking ?? Infinity));
                  const isHighest = school.ranking === highest;
                  return (
                    <td key={school.slug} className={`p-4 text-center text-sm font-semibold ${isHighest && school.ranking != null ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}>
                      <StatCell value={school.ranking} format="rank" />
                    </td>
                  );
                })}
                {schools.length < 4 && <td />}
              </tr>

              {/* Programs */}
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 align-top">
                  Programs
                </td>
                {schools.map((school) => (
                  <td key={school.slug} className="p-4 text-center align-top">
                    {school.programs && school.programs.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {school.programs.slice(0, 4).map((p) => (
                          <Badge key={p} variant="primary">{p}</Badge>
                        ))}
                        {school.programs.length > 4 && (
                          <Badge variant="default">+{school.programs.length - 4}</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </td>
                ))}
                {schools.length < 4 && <td />}
              </tr>

              {/* Website */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Website
                </td>
                {schools.map((school) => (
                  <td key={school.slug} className="p-4 text-center">
                    {school.website ? (
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </td>
                ))}
                {schools.length < 4 && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
