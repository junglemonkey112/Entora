"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, ChevronRight, ThumbsUp, AlertTriangle, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

const promptTypes = [
  { value: "common-app", label: "Common App Personal Statement" },
  { value: "why-us", label: "Why Us Essay" },
  { value: "supplemental", label: "Supplemental Essay (Other)" },
  { value: "scholarship", label: "Scholarship Essay" },
  { value: "ucas-personal", label: "UCAS Personal Statement" },
];

interface Feedback {
  strengths: string[];
  improvements: string[];
  specific_suggestions: string[];
  overall: string;
}

export default function EssayReviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [essay, setEssay] = useState("");
  const [promptType, setPromptType] = useState("common-app");
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState("");

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <BookOpen className="h-14 w-14 text-indigo-600 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          AI Essay Feedback
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Sign in to get instant AI-powered feedback on your college essays.
        </p>
        <Link href="/login">
          <Button>Sign in to continue</Button>
        </Link>
      </div>
    );
  }

  if (loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essay.trim() || essay.trim().split(/\s+/).length < 50) {
      setError("Please paste at least 50 words to get useful feedback.");
      return;
    }
    setError("");
    setFeedback(null);
    setReviewing(true);

    try {
      const res = await fetch("/api/essays/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: essay.trim(), promptType }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg ?? "Failed to get feedback. Please try again.");
        return;
      }

      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-4">
          <BookOpen className="h-3.5 w-3.5" />
          AI Essay Review
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Get instant feedback on your essay
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Our AI advisor will review your essay and give you structured feedback
          on strengths, areas to improve, and specific suggestions.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Essay type
              </label>
              <select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {promptTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paste your essay
              </label>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste your essay here (minimum 50 words)…"
                rows={14}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {essay.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={reviewing || !essay.trim()}
            >
              {reviewing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Reviewing…
                </>
              ) : (
                <>
                  Get feedback
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Tips sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-neutral-950">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              What you&apos;ll get
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                Specific strengths to keep
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                Areas to improve
              </li>
              <li className="flex gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                Line-level suggestions
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 p-4 bg-indigo-50 dark:bg-indigo-900/20">
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              <strong>Want a human review?</strong> Book a session with a Student
              Counselor on{" "}
              <Link href="/guides" className="underline">
                /guides
              </Link>{" "}
              who has been through the same process.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback result */}
      {feedback && (
        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800 pt-8">
            Feedback
          </h2>

          <div className="p-5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {feedback.overall}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-5">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-700 dark:text-green-400 flex gap-2">
                    <span className="shrink-0 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-5">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Areas to improve
              </h3>
              <ul className="space-y-2">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-700 dark:text-amber-400 flex gap-2">
                    <span className="shrink-0 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 p-5">
            <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Specific suggestions
            </h3>
            <ol className="space-y-2">
              {feedback.specific_suggestions.map((s, i) => (
                <li key={i} className="text-sm text-indigo-700 dark:text-indigo-400 flex gap-2">
                  <span className="shrink-0 font-medium">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
