import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, MapPin, Percent, DollarSign, Trophy,
  BookOpen, MessageSquare, Star, ShieldCheck, Clock, ThumbsUp, ArrowRight,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

const specialtyLabels: Record<string, string> = {
  essays: "Essays",
  "us-applications": "US Apps",
  "uk-applications": "UK Apps",
  "financial-aid": "Financial Aid",
  "test-prep": "Test Prep",
  international: "International",
};

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

  // Guides who attend or were accepted to this school
  const { data: guides } = await supabase
    .from("guide_profiles")
    .select(`*, profile:profiles!user_id(full_name, country)`)
    .eq("is_active", true)
    .or(`universities_attended.cs.{"${school.name}"},also_accepted_to.cs.{"${school.name}"}`)
    .order("rating", { ascending: false })
    .limit(3);

  // Community posts tagged with this school's slug
  const { data: posts } = await supabase
    .from("forum_posts")
    .select(`*, author:profiles!author_id(full_name, role), category:forum_categories!category_id(name)`)
    .contains("school_tags", [slug])
    .order("created_at", { ascending: false })
    .limit(5);

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
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="h-16 w-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
          {school.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {school.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" />
            {[school.city, school.state, school.country].filter(Boolean).join(", ")}
          </p>
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
            >
              Visit website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <Link
          href={`/schools/compare?schools=${slug}`}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          + Compare
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center">
          <Percent className="h-6 w-6 text-teal-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.acceptance_rate != null ? `${school.acceptance_rate}%` : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Acceptance Rate</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center">
          <DollarSign className="h-6 w-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.avg_cost != null ? `$${school.avg_cost.toLocaleString()}` : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Annual Cost</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center">
          <Trophy className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {school.ranking != null ? `#${school.ranking}` : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">National Ranking</p>
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
            Programs &amp; Strengths
          </h2>
          <div className="flex flex-wrap gap-2">
            {school.programs.map((program: string) => (
              <Badge key={program} variant="primary">{program}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* ── Guides from this school ─────────────────────────────── */}
      {guides && guides.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Student Counselors from {school.name}
            </h2>
            <Link
              href={`/guides?university=${encodeURIComponent(school.name)}`}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guides.map((g) => {
              const gName = (g.profile as { full_name: string } | null)?.full_name ?? g.slug;
              const initials = gName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
              const attendsThis = (g.universities_attended as string[] | null)?.includes(school.name);
              return (
                <Link
                  key={g.id}
                  href={`/guides/${g.slug}`}
                  className="flex flex-col p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-300 shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center gap-1">
                        {gName}
                        {g.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {attendsThis ? "Attends" : "Accepted to"} {school.name}
                      </p>
                    </div>
                  </div>
                  {g.specialties && (g.specialties as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(g.specialties as string[]).slice(0, 2).map((s: string) => (
                        <Badge key={s} variant="secondary">{specialtyLabels[s] ?? s}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    {g.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {Number(g.rating).toFixed(2)}
                      </span>
                    )}
                    {g.hourly_rate && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        ${g.hourly_rate}/hr
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Community discussions tagged with this school ────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Community discussions
          </h2>
          <Link
            href="/community/new"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Start a thread
          </Link>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              No discussions tagged with {school.name} yet.
            </p>
            <Link
              href="/community/new"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Be the first to start one <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/post/${post.id}`}
                className="block p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all bg-white dark:bg-neutral-950"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </span>
                  {post.category && (
                    <Badge variant="primary">{(post.category as { name: string }).name}</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {post.likes_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {post.comments_count}
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href="/community"
              className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
            >
              See all community threads →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
