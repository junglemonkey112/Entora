"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const expertiseOptions = [
  { value: "essays", label: "Essays & Personal Statements" },
  { value: "test-prep", label: "Test Prep (SAT/ACT/IELTS/TOEFL)" },
  { value: "financial-aid", label: "Financial Aid & Scholarships" },
  { value: "us-applications", label: "US Applications (Common App)" },
  { value: "uk-applications", label: "UK Applications (UCAS)" },
  { value: "international", label: "International Student Guidance" },
];

export default function BecomeCounselorPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    university: "",
    grad_year: "",
    applied_to: "",
    expertise: [] as string[],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleExpertise = (value: string) => {
    setForm((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(value)
        ? prev.expertise.filter((e) => e !== value)
        : [...prev.expertise, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const appliedToArray = form.applied_to
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error: dbError } = await supabase
      .from("counselor_applications")
      .insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        university: form.university.trim(),
        grad_year: form.grad_year ? parseInt(form.grad_year, 10) : null,
        applied_to: appliedToArray.length > 0 ? appliedToArray : null,
        expertise: form.expertise.length > 0 ? form.expertise : null,
        message: form.message.trim(),
      });

    if (dbError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-5">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Application received!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Thank you for applying to become a Student Counselor. We&apos;ll review
          your application and get back to you within a few days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/counselors">
            <Button variant="outline">See Student Counselors</Button>
          </Link>
          <Link href="/community">
            <Button>Go to Community</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/counselors"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Student Counselors
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 mb-4">
          <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Become a Student Counselor
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Share your college admissions experience and help students who are going
          through the same journey you did.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* University + Grad Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your university <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.university}
              onChange={(e) => setForm((p) => ({ ...p, university: e.target.value }))}
              placeholder="e.g. University of Toronto"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Graduation year
            </label>
            <input
              type="number"
              min={2020}
              max={2035}
              value={form.grad_year}
              onChange={(e) => setForm((p) => ({ ...p, grad_year: e.target.value }))}
              placeholder="e.g. 2026"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Applied to */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Schools you applied to
          </label>
          <input
            type="text"
            value={form.applied_to}
            onChange={(e) => setForm((p) => ({ ...p, applied_to: e.target.value }))}
            placeholder="e.g. MIT, Stanford, Oxford (comma-separated)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">Separate multiple schools with commas.</p>
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Areas of expertise
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {expertiseOptions.map((opt) => {
              const checked = form.expertise.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleExpertise(opt.value)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                    checked
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                      checked
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {checked && (
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M3.5 6.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Why do you want to help? <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            placeholder="Tell us about your admissions journey and how you'd like to support other students..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit application"}
        </Button>
      </form>
    </div>
  );
}
