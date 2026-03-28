"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import {
  CheckCircle,
  Circle,
  BookOpen,
  FileText,
  Trophy,
  PenTool,
  Send,
  DollarSign,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Milestone {
  id: string;
  grade: number;
  title: string;
  description: string | null;
  category: string;
  due_month: string | null;
  sort_order: number;
}

interface RoadmapTimelineProps {
  milestones: Milestone[];
  completedIds: string[];
  isLoggedIn: boolean;
}

const grades = [
  { value: 9, label: "Grade 9", subtitle: "Explore & Build" },
  { value: 10, label: "Grade 10", subtitle: "Focus & Prepare" },
  { value: 11, label: "Grade 11", subtitle: "Test & Apply Early" },
  { value: 12, label: "Grade 12", subtitle: "Apply & Decide" },
];

const categoryConfig: Record<
  string,
  {
    icon: typeof BookOpen;
    variant: "primary" | "secondary" | "success" | "warning" | "default" | "outline";
    label: string;
  }
> = {
  academics: { icon: BookOpen, variant: "primary", label: "Academics" },
  testing: { icon: FileText, variant: "warning", label: "Testing" },
  extracurriculars: { icon: Trophy, variant: "secondary", label: "Extracurriculars" },
  essays: { icon: PenTool, variant: "default", label: "Essays" },
  applications: { icon: Send, variant: "success", label: "Applications" },
  financial: { icon: DollarSign, variant: "outline", label: "Financial" },
};

export default function RoadmapTimeline({
  milestones,
  completedIds: initialCompletedIds,
  isLoggedIn,
}: RoadmapTimelineProps) {
  const [activeGrade, setActiveGrade] = useState(9);
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const supabase = createClient();

  const gradeMilestones = milestones.filter((m) => m.grade === activeGrade);
  const gradeCompleted = gradeMilestones.filter((m) =>
    completedIds.includes(m.id)
  ).length;
  const gradeTotal = gradeMilestones.length;
  const progressPercent = gradeTotal > 0 ? (gradeCompleted / gradeTotal) * 100 : 0;

  // Group milestones by category
  const grouped = gradeMilestones.reduce(
    (acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m);
      return acc;
    },
    {} as Record<string, Milestone[]>
  );

  const toggleMilestone = async (milestoneId: string) => {
    if (!isLoggedIn || togglingId) return;
    setTogglingId(milestoneId);

    const isCompleted = completedIds.includes(milestoneId);

    // Optimistic update
    if (isCompleted) {
      setCompletedIds((prev) => prev.filter((id) => id !== milestoneId));
    } else {
      setCompletedIds((prev) => [...prev, milestoneId]);
    }

    try {
      if (isCompleted) {
        await supabase
          .from("user_milestones")
          .delete()
          .eq("milestone_id", milestoneId);
      } else {
        await supabase.from("user_milestones").insert({
          milestone_id: milestoneId,
        });
      }
    } catch {
      // Revert on error
      if (isCompleted) {
        setCompletedIds((prev) => [...prev, milestoneId]);
      } else {
        setCompletedIds((prev) => prev.filter((id) => id !== milestoneId));
      }
    }

    setTogglingId(null);
  };

  return (
    <div>
      {/* Grade tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {grades.map((g) => {
          const gMilestones = milestones.filter((m) => m.grade === g.value);
          const gCompleted = gMilestones.filter((m) =>
            completedIds.includes(m.id)
          ).length;
          const gTotal = gMilestones.length;

          return (
            <button
              key={g.value}
              onClick={() => setActiveGrade(g.value)}
              className={cn(
                "shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-0.5 min-w-[100px]",
                activeGrade === g.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <span className="font-semibold">{g.label}</span>
              <span
                className={cn(
                  "text-xs",
                  activeGrade === g.value
                    ? "text-indigo-200"
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                {isLoggedIn && gTotal > 0
                  ? `${gCompleted}/${gTotal} done`
                  : g.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      {isLoggedIn && gradeTotal > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {grades.find((g) => g.value === activeGrade)?.label} Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {gradeCompleted} of {gradeTotal} milestones
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Sign-in banner for non-logged-in users */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm text-indigo-700 dark:text-indigo-300">
              Sign in to track your progress and check off milestones
            </span>
          </div>
          <Link
            href="/login"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Milestones by category */}
      {gradeMilestones.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No milestones yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Milestones for this grade will appear once the database is seeded.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => {
            const config = categoryConfig[category] || {
              icon: BookOpen,
              variant: "default" as const,
              label: category,
            };
            const CategoryIcon = config.icon;

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <CategoryIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Badge variant={config.variant}>{config.label}</Badge>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {items.filter((m) => completedIds.includes(m.id)).length}/
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((milestone) => {
                    const isCompleted = completedIds.includes(milestone.id);
                    const isToggling = togglingId === milestone.id;

                    return (
                      <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(milestone.id)}
                        disabled={!isLoggedIn || isToggling}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 group",
                          isCompleted
                            ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm",
                          !isLoggedIn && "cursor-default"
                        )}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Circle
                              className={cn(
                                "h-5 w-5 transition-colors",
                                isLoggedIn
                                  ? "text-gray-300 dark:text-gray-600 group-hover:text-indigo-400"
                                  : "text-gray-300 dark:text-gray-600"
                              )}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3
                              className={cn(
                                "text-sm font-medium",
                                isCompleted
                                  ? "text-green-800 dark:text-green-300 line-through"
                                  : "text-gray-900 dark:text-white"
                              )}
                            >
                              {milestone.title}
                            </h3>
                            {milestone.due_month && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                {milestone.due_month}
                              </span>
                            )}
                          </div>
                          {milestone.description && (
                            <p
                              className={cn(
                                "text-sm mt-0.5",
                                isCompleted
                                  ? "text-green-600/70 dark:text-green-400/60"
                                  : "text-gray-500 dark:text-gray-400"
                              )}
                            >
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
