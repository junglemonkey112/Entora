"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const specialtyOptions = [
  { value: "essays", label: "Essays" },
  { value: "us-applications", label: "US Apps" },
  { value: "uk-applications", label: "UK Apps" },
  { value: "financial-aid", label: "Financial Aid" },
  { value: "test-prep", label: "Test Prep" },
  { value: "international", label: "International" },
];

const countryOptions = [
  "China", "South Korea", "Japan", "India", "United States",
  "United Kingdom", "Canada", "Australia", "Singapore", "Other",
];

const languageOptions = [
  "English", "Mandarin", "Korean", "Japanese", "Hindi", "Spanish",
];

const priceOptions = [
  { value: "", label: "Any price" },
  { value: "50", label: "Under $50/hr" },
  { value: "75", label: "Under $75/hr" },
  { value: "100", label: "Under $100/hr" },
];

export default function GuideFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = (key: string) => searchParams.get(key) ?? "";

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/guides?${params.toString()}`);
  }, [router, searchParams]);

  const toggleSpecialty = (value: string) => {
    const current = searchParams.get("specialty") ?? "";
    update("specialty", current === value ? "" : value);
  };

  return (
    <div className="space-y-5">
      {/* Specialty chips */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          Specialty
        </p>
        <div className="flex flex-wrap gap-2">
          {specialtyOptions.map((opt) => {
            const isActive = active("specialty") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => toggleSpecialty(opt.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Country */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            Country of origin
          </label>
          <select
            value={active("country")}
            onChange={(e) => update("country", e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All countries</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            Language
          </label>
          <select
            value={active("language")}
            onChange={(e) => update("language", e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any language</option>
            {languageOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            Max price / hr
          </label>
          <select
            value={active("maxPrice")}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {priceOptions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
