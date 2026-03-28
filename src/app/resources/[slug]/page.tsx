import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
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

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!resource) notFound();

  const config = typeConfig[resource.type] || {
    icon: BookOpen,
    variant: "default" as const,
    label: resource.type,
  };
  const TypeIcon = config.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to resources
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TypeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Badge variant={config.variant}>{config.label}</Badge>
          {resource.category && (
            <Badge variant="outline">{resource.category}</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {resource.title}
        </h1>
        {resource.author_name && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By {resource.author_name}
          </p>
        )}
      </div>

      {/* Content */}
      <article className="prose dark:prose-invert max-w-none mb-12">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {resource.content}
        </div>
      </article>

      {/* CTA */}
      <div className="p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-center">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Found this helpful?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Join thousands of students sharing insights in our community.
        </p>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Join the community
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
