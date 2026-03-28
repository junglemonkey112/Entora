import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Eye,
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  Map,
  GraduationCap,
  Star,
  X,
} from "lucide-react";

const traditional = [
  { text: "$8,000 – $25,000 total", icon: DollarSign },
  { text: "Limited to 1 counselor's perspective", icon: Users },
  { text: "Opaque process — you wait and hope", icon: Eye },
  { text: "Sessions at counselor's schedule", icon: Clock },
];

const entora = [
  { text: "From $35 per session, pay as you go", icon: DollarSign },
  { text: "Community of current students + AI + specialists", icon: Users },
  { text: "Post-session summaries sent to your inbox", icon: Eye },
  { text: "On-demand — book when your child needs it", icon: Clock },
];

const trustSignals = [
  {
    value: "29",
    label: "Milestones tracked",
    description: "Grade 9-12 roadmap so nothing falls through the cracks",
    icon: Map,
  },
  {
    value: "24+",
    label: "Universities indexed",
    description: "Compare acceptance rates, costs, and programs side by side",
    icon: GraduationCap,
  },
  {
    value: "Free",
    label: "Community + resources",
    description: "Essay examples, financial aid guides, and visa checklists",
    icon: CheckCircle,
  },
  {
    value: "$35",
    label: "Expert sessions from",
    description: "Verified guides at top universities, rated by students",
    icon: Star,
  },
];

const milestonePreview = [
  { grade: 9, title: "Join clubs and explore interests", done: true },
  { grade: 9, title: "Start building GPA tracking habits", done: true },
  { grade: 10, title: "Take PSAT / practice tests", done: true },
  { grade: 10, title: "Research summer programs", done: false },
  { grade: 11, title: "Take SAT/ACT", done: false },
  { grade: 11, title: "Start Common App essay draft", done: false },
];

export default function ParentsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-3 py-1 text-sm font-medium text-teal-700 dark:text-teal-300 mb-6">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            For Parents
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Expert college guidance without the expert price tag
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Entora gives your child everything a $25,000 private counselor
            provides &mdash; for $35 per session. Transparent progress tracking,
            verified guides, and a community that has their back.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              See the roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Side-by-side: traditional vs. Entora
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Private college counseling costs families $8,000&ndash;$25,000 on
            average. Here&rsquo;s what you get with Entora instead.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Traditional Counselor
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                $8,000 &ndash; $25,000
              </p>
              <div className="space-y-3">
                {traditional.map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entora */}
            <div className="p-6 rounded-xl border-2 border-teal-600 bg-white dark:bg-neutral-950 relative">
              <span className="absolute -top-3 left-6 px-3 py-0.5 bg-teal-600 text-white text-xs font-medium rounded-full">
                Recommended
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Entora
              </h3>
              <p className="text-3xl font-bold text-teal-600 mb-6">
                From $35<span className="text-base font-normal text-gray-500"> /session</span>
              </p>
              <div className="space-y-3">
                {entora.map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Everything you need to feel confident
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((signal) => (
              <div
                key={signal.label}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-center"
              >
                <signal.icon className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {signal.value}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  {signal.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Tracker Preview */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              See exactly where your child stands
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              The milestone tracker gives you real-time visibility into your
              child&rsquo;s progress &mdash; no hovering required. You&rsquo;ll
              know when a session is needed before they ask.
            </p>
          </div>

          {/* Preview card */}
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Milestone Progress
              </h3>
              <span className="text-xs text-teal-600 font-medium">
                3 of 6 done
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-5">
              <div className="h-full w-1/2 bg-teal-600 rounded-full" />
            </div>
            <div className="space-y-2.5">
              {milestonePreview.map((m) => (
                <div
                  key={m.title}
                  className="flex items-center gap-3 text-sm"
                >
                  {m.done ? (
                    <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0" />
                  )}
                  <span
                    className={
                      m.done
                        ? "text-gray-400 dark:text-gray-500 line-through"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  >
                    {m.title}
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    Gr. {m.grade}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/roadmap"
              className="mt-5 block text-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              See the full roadmap &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-12 w-12 text-teal-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your child&rsquo;s college journey starts here
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Join for free. Explore the community, roadmap, and resources. Book a
            session when you&rsquo;re ready &mdash; no commitment required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-8 py-3 text-base font-medium text-white hover:bg-teal-700 transition-colors shadow-sm"
          >
            Get started free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
