import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  FileText,
  CheckSquare,
  Globe,
  Star,
  BookOpen,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

const typeConfig: Record<
  string,
  {
    icon: typeof FileText;
    variant: "primary" | "secondary" | "success" | "warning";
    label: string;
  }
> = {
  essay_example: { icon: FileText, variant: "primary", label: "Essay Example" },
  checklist: { icon: CheckSquare, variant: "success", label: "Checklist" },
  visa_guide: { icon: Globe, variant: "secondary", label: "Visa Guide" },
  success_story: { icon: Star, variant: "warning", label: "Success Story" },
};

const typeFilters = [
  { slug: null, label: "All" },
  { slug: "essay_example", label: "Essays" },
  { slug: "checklist", label: "Checklists" },
  { slug: "visa_guide", label: "Visa Guides" },
  { slug: "success_story", label: "Stories" },
];

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const activeType = params.type || null;

  let query = supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeType) {
    query = query.eq("type", activeType);
  }

  const { data: resources } = await query;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resource Library
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Free essay examples, financial aid checklists, visa guides, and
          &ldquo;how I got in&rdquo; stories from current students. 90% of users
          get something for free &mdash; this is the trust funnel.
        </p>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {typeFilters.map((filter) => (
          <Link
            key={filter.label}
            href={
              filter.slug
                ? `/resources?type=${filter.slug}`
                : "/resources"
            }
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeType === filter.slug
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Resources grid */}
      {!resources || resources.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No resources yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Resources will appear once the database is seeded.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const config = typeConfig[resource.type] || {
              icon: BookOpen,
              variant: "default" as const,
              label: resource.type,
            };
            const TypeIcon = config.icon;

            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className="group p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-neutral-900 flex items-center justify-center shrink-0">
                    <TypeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      {resource.category && (
                        <Badge variant="outline">{resource.category}</Badge>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                      {resource.title}
                    </h3>
                    {resource.preview_text && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {resource.preview_text}
                      </p>
                    )}
                    {resource.author_name && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        By {resource.author_name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
