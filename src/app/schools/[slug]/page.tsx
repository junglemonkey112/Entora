import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Percent,
  DollarSign,
  Trophy,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("universities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!school) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/schools"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to schools
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-4 mb-8">
        <div className="h-16 w-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
          {school.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {school.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" />
            {[school.city, school.state, school.country]
              .filter(Boolean)
              .join(", ")}
          </p>
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
            >
              Visit website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center">
          <Percent className="h-6 w-6 text-teal-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.acceptance_rate != null
              ? `${school.acceptance_rate}%`
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acceptance Rate
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center">
          <DollarSign className="h-6 w-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.avg_cost != null
              ? `$${school.avg_cost.toLocaleString()}`
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Average Annual Cost
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center">
          <Trophy className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.ranking != null ? `#${school.ranking}` : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            National Ranking
          </p>
        </div>
      </div>

      {/* Description */}
      {school.description && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            About
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {school.description}
          </p>
        </div>
      )}

      {/* Programs */}
      {school.programs && school.programs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Programs & Strengths
          </h2>
          <div className="flex flex-wrap gap-2">
            {school.programs.map((program: string) => (
              <Badge key={program} variant="primary">
                {program}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Community link */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Community discussions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask questions and hear from students at {school.name}
            </p>
          </div>
          <Link
            href="/community"
            className="ml-auto shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse threads
          </Link>
        </div>
      </div>
    </div>
  );
}
