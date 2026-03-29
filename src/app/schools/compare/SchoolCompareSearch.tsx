"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface UniversityOption {
  name: string;
  slug: string;
}

interface Props {
  allUniversities: UniversityOption[];
  currentSlugs: string[];
}

export default function SchoolCompareSearch({ allUniversities, currentSlugs }: Props) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState<UniversityOption[]>([]);

  useEffect(() => {
    if (input.length < 2) {
      setFiltered([]);
      return;
    }
    const lower = input.toLowerCase();
    setFiltered(
      allUniversities
        .filter((u) => u.name.toLowerCase().includes(lower) && !currentSlugs.includes(u.slug))
        .slice(0, 8)
    );
  }, [input, allUniversities, currentSlugs]);

  const addSchool = (slug: string) => {
    const newSlugs = [...currentSlugs, slug];
    router.push(`/schools/compare?schools=${newSlugs.join(",")}`);
    setInput("");
    setFiltered([]);
  };

  if (currentSlugs.length >= 4) return null;

  return (
    <div className="relative max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a school to compare…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-lg py-1 z-20">
          {filtered.map((opt) => (
            <button
              key={opt.slug}
              type="button"
              onClick={() => addSchool(opt.slug)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
