"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const outcomes = [
  { value: "accepted", label: "Accepted" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "rejected", label: "Rejected" },
];

const expertiseOptions = [
  "Essays",
  "Financial Aid",
  "SAT / ACT",
  "IELTS / TOEFL",
  "Extracurriculars",
  "Interviews",
  "UK Applications",
  "Visa Process",
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SubmitStoryPage() {
  const supabase = createClient();

  const [school, setSchool] = useState("");
  const [outcome, setOutcome] = useState("accepted");
  const [country, setCountry] = useState("");
  const [major, setMajor] = useState("");
  const [gpaRange, setGpaRange] = useState("");
  const [testScores, setTestScores] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [narrative, setNarrative] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const title = `How I got ${outcome === "accepted" ? "into" : outcome === "waitlisted" ? "waitlisted at" : "rejected from"} ${school}`;
    const slug = `${slugify(school)}-${outcome}-${Date.now()}`;

    const { error: insertError } = await supabase.from("resources").insert({
      slug,
      type: "success_story",
      title,
      preview_text: narrative.slice(0, 200),
      author_name: authorName.trim() || "Anonymous",
      content: narrative.trim(),
      school_slug: slugify(school),
      outcome,
      country: country.trim() || null,
      major: major.trim() || null,
      gpa_range: gpaRange.trim() || null,
      test_scores: testScores.trim() || null,
      is_published: false,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Story submitted!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Thank you for sharing your experience. Your story will be reviewed and
          published within a few days.
        </p>
        <Link href="/resources">
          <Button variant="outline">Back to resources</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to resources
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Share your admissions story
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
        Help future applicants by sharing what your application process was
        really like — accepted, waitlisted, or rejected.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          id="school"
          label="University applied to"
          placeholder="e.g. MIT, University of Toronto"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Outcome
          </label>
          <div className="flex gap-2">
            {outcomes.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setOutcome(o.value)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  outcome === o.value
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="author_name"
          label="Your name (or leave blank for Anonymous)"
          placeholder="e.g. Priya K."
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="country"
            label="Country of origin"
            placeholder="e.g. India"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Input
            id="major"
            label="Intended major"
            placeholder="e.g. CS, Biology"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="gpa_range"
            label="GPA range (optional)"
            placeholder="e.g. 3.8–4.0"
            value={gpaRange}
            onChange={(e) => setGpaRange(e.target.value)}
          />
          <Input
            id="test_scores"
            label="Test scores (optional)"
            placeholder="e.g. SAT 1520, TOEFL 108"
            value={testScores}
            onChange={(e) => setTestScores(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your story
          </label>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="What was your application process like? What worked? What would you do differently? Any tips for future applicants?"
            rows={8}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/resources">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button
            type="submit"
            disabled={!school.trim() || !narrative.trim() || submitting}
          >
            {submitting ? "Submitting…" : "Submit story"}
          </Button>
        </div>
      </form>
    </div>
  );
}
