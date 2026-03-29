import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GraduationCap, MapPin, ArrowRight, MessageSquare } from "lucide-react";
import Badge from "@/components/ui/Badge";

const expertiseLabels: Record<string, string> = {
  essays: "Essays",
  "test-prep": "Test Prep",
  "financial-aid": "Financial Aid",
  "us-applications": "US Applications",
  "uk-applications": "UK Applications",
  international: "International",
};

export default async function CounselorsPage() {
  const supabase = await createClient();

  const { data: counselors } = await supabase
    .from("profiles")
    .select("id, full_name, country, university, grad_year, applied_to, expertise")
    .eq("role", "guide")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 mb-4">
          <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Find a Student Counselor
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Connect with students who have successfully navigated college admissions
          and can share their firsthand experience with you.
        </p>
      </div>

      {/* Counselor grid */}
      {!counselors || counselors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            No student counselors listed yet. Be the first!
          </p>
          <Link
            href="/become-counselor"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Become a Student Counselor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {counselors.map((c) => {
            const initials = c.full_name
              ? c.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "?";

            return (
              <div
                key={c.id}
                className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-base font-semibold text-indigo-700 dark:text-indigo-300 shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {c.full_name}
                    </p>
                    {c.country && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {c.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* University */}
                {c.university && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                      At university
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {c.university}
                      {c.grad_year ? ` · Class of ${c.grad_year}` : ""}
                    </p>
                  </div>
                )}

                {/* Applied to */}
                {c.applied_to && c.applied_to.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                      Applied to
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(c.applied_to as string[]).slice(0, 4).join(", ")}
                      {(c.applied_to as string[]).length > 4 ? " +" + ((c.applied_to as string[]).length - 4) + " more" : ""}
                    </p>
                  </div>
                )}

                {/* Expertise tags */}
                {c.expertise && c.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(c.expertise as string[]).map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {expertiseLabels[tag] ?? tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Message button */}
                <div className="mt-auto">
                  <Link
                    href="/community"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message in Community
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA banner */}
      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Are you a university student?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-lg mx-auto">
          Help future students navigate college admissions by sharing what you&apos;ve learned. Become a Student Counselor on Entora.
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
