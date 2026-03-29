"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SubmitTestimonialPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [schoolAccepted, setSchoolAccepted] = useState("");
  const [country, setCountry] = useState("");
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("testimonials").insert({
      name: name.trim(),
      school_accepted: schoolAccepted.trim(),
      country: country.trim() || null,
      quote: quote.trim(),
      is_featured: false,
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
          Thank you!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your story has been submitted and will appear on the site once reviewed
          by our team.
        </p>
        <Link href="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Share your story
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
        Inspire other students by sharing how Entora helped you in your college
        admissions journey.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          id="name"
          label="Your name"
          placeholder="e.g. Priya K."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="school_accepted"
          label="School accepted to"
          placeholder="e.g. MIT Class of 2028"
          value={schoolAccepted}
          onChange={(e) => setSchoolAccepted(e.target.value)}
          required
        />

        <Input
          id="country"
          label="Country of origin (optional)"
          placeholder="e.g. India"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your story
          </label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="How did Entora help you? What would you tell other students?"
            rows={5}
            maxLength={400}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
            {quote.length}/400
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button
            type="submit"
            disabled={!name.trim() || !schoolAccepted.trim() || !quote.trim() || submitting}
          >
            {submitting ? "Submitting…" : "Submit story"}
          </Button>
        </div>
      </form>
    </div>
  );
}
