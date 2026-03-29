"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

interface GuideProfile {
  id: string;
  slug: string;
  hourly_rate: number | null;
  profile: { full_name: string } | null;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function displayDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

export default function BookPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [guide, setGuide] = useState<GuideProfile | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [topic, setTopic] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchGuide = async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("id, slug, hourly_rate, profile:profiles!user_id(full_name)")
        .eq("slug", params.slug)
        .eq("is_active", true)
        .single();
      setGuide(data as GuideProfile | null);
      setLoadingGuide(false);
    };
    fetchGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  // Generate next 14 available days (skip Sundays for simplicity)
  const availableDates = Array.from({ length: 20 }, (_, i) => addDays(new Date(), i + 1))
    .filter((d) => d.getDay() !== 0)
    .slice(0, 14)
    .map(formatDate);

  const handleBooking = async () => {
    if (!user || !guide || !selectedDate || !selectedTime) return;
    setError("");
    setSubmitting(true);

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

    try {
      const res = await fetch("/api/bookings/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideId: guide.id,
          scheduledAt,
          topic: topic.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create booking");
        setSubmitting(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else if (data.bookingId) {
        // Free booking (no Stripe)
        router.push(`/guides/${params.slug}/book/success?booking_id=${data.bookingId}`);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (authLoading || loadingGuide) return null;
  if (!guide) return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center text-gray-500">Guide not found.</div>
  );

  const guideName = (guide.profile as { full_name: string } | null)?.full_name ?? guide.slug;

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-10">
      <Link
        href={`/guides/${params.slug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {guideName}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Book a session
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        60-minute video call with{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">{guideName}</span>
        {guide.hourly_rate ? ` · $${guide.hourly_rate}` : " · Free"}
      </p>

      {step === 1 ? (
        <div className="space-y-6">
          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Select a date
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableDates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 px-1 rounded-lg border text-xs text-center transition-all ${
                    selectedDate === d
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}
                >
                  {displayDate(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Time picker */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Select a time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-lg border text-sm text-center transition-all ${
                      selectedTime === t
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!selectedDate || !selectedTime}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-sm">
            <p className="font-medium text-indigo-700 dark:text-indigo-300">
              {displayDate(selectedDate)} at {selectedTime}
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-indigo-500 hover:underline mt-0.5"
            >
              Change
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What would you like to discuss? (optional)
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Common App essay brainstorm, school list review, financial aid questions…"
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" onClick={handleBooking} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing…
                </>
              ) : guide.hourly_rate ? (
                `Confirm & Pay $${guide.hourly_rate}`
              ) : (
                "Confirm booking"
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Sessions are 60 minutes via video call. Cancel up to 24 hours before.
          </p>
        </div>
      )}
    </div>
  );
}
