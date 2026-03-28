"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Percent,
  DollarSign,
  Trophy,
  GraduationCap,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface University {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string | null;
  state: string | null;
  acceptance_rate: number | null;
  avg_cost: number | null;
  ranking: number | null;
  programs: string[] | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
}

const countryOptions = ["All", "US", "UK", "CA", "AU"];
const acceptanceOptions = [
  { label: "All", min: 0, max: 100 },
  { label: "< 10%", min: 0, max: 10 },
  { label: "10–25%", min: 10, max: 25 },
  { label: "25–50%", min: 25, max: 50 },
  { label: "> 50%", min: 50, max: 100 },
];
const costOptions = [
  { label: "All", min: 0, max: Infinity },
  { label: "< $30k", min: 0, max: 30000 },
  { label: "$30–50k", min: 30000, max: 50000 },
  { label: "> $50k", min: 50000, max: Infinity },
];

function formatCost(cost: number): string {
  if (cost >= 1000) return `$${(cost / 1000).toFixed(0)}k`;
  return `$${cost}`;
}

export default function SchoolExplorer({
  universities,
}: {
  universities: University[];
}) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [acceptanceIdx, setAcceptanceIdx] = useState(0);
  const [costIdx, setCostIdx] = useState(0);

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matches =
          u.name.toLowerCase().includes(q) ||
          u.city?.toLowerCase().includes(q) ||
          u.state?.toLowerCase().includes(q) ||
          u.programs?.some((p) => p.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Country
      if (country !== "All" && u.country !== country) return false;

      // Acceptance rate
      const acc = acceptanceOptions[acceptanceIdx];
      if (acceptanceIdx > 0 && u.acceptance_rate != null) {
        if (u.acceptance_rate < acc.min || u.acceptance_rate > acc.max)
          return false;
      }

      // Cost
      const cost = costOptions[costIdx];
      if (costIdx > 0 && u.avg_cost != null) {
        if (u.avg_cost < cost.min || u.avg_cost > cost.max) return false;
      }

      return true;
    });
  }, [universities, search, country, acceptanceIdx, costIdx]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, city, state, or program..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Country
          </label>
          <div className="flex gap-1.5">
            {countryOptions.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  country === c
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Acceptance Rate */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Acceptance Rate
          </label>
          <div className="flex gap-1.5">
            {acceptanceOptions.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => setAcceptanceIdx(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  acceptanceIdx === i
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Average Cost
          </label>
          <div className="flex gap-1.5">
            {costOptions.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => setCostIdx(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  costIdx === i
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} universit{filtered.length === 1 ? "y" : "ies"} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No universities match
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search term.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((uni) => (
            <Link
              key={uni.id}
              href={`/schools/${uni.slug}`}
              className="group p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {uni.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {[uni.city, uni.state, uni.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {uni.acceptance_rate != null && (
                  <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-neutral-900">
                    <Percent className="h-3.5 w-3.5 text-teal-600 mx-auto mb-0.5" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {uni.acceptance_rate}%
                    </p>
                    <p className="text-[10px] text-gray-400">Accept</p>
                  </div>
                )}
                {uni.avg_cost != null && (
                  <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-neutral-900">
                    <DollarSign className="h-3.5 w-3.5 text-amber-600 mx-auto mb-0.5" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {formatCost(uni.avg_cost)}
                    </p>
                    <p className="text-[10px] text-gray-400">Avg cost</p>
                  </div>
                )}
                {uni.ranking != null && (
                  <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-neutral-900">
                    <Trophy className="h-3.5 w-3.5 text-indigo-600 mx-auto mb-0.5" />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      #{uni.ranking}
                    </p>
                    <p className="text-[10px] text-gray-400">Ranking</p>
                  </div>
                )}
              </div>

              {/* Programs */}
              {uni.programs && uni.programs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {uni.programs.slice(0, 3).map((program) => (
                    <Badge key={program} variant="default">
                      {program}
                    </Badge>
                  ))}
                  {uni.programs.length > 3 && (
                    <Badge variant="outline">
                      +{uni.programs.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
