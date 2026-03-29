"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  GraduationCap,
  User,
  Users,
  School,
  Briefcase,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roleIcons = {
  student:    User,
  parent:     Users,
  counselor:  School,
  specialist: Briefcase,
  school_rep: Building2,
};

// Maps signup role key → DB role value
const roleToDbRole: Record<string, string> = {
  student:    "student",
  parent:     "parent",
  counselor:  "counselor",
  specialist: "specialist",
  school_rep: "university_admin",
};

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [roleKey, setRoleKey] = useState<keyof typeof roleIcons>("student");
  const [country, setCountry] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();

  const roles = (
    Object.keys(roleIcons) as Array<keyof typeof roleIcons>
  ).map((id) => ({
    id,
    label: t.signup.roles[id].label,
    description: t.signup.roles[id].desc,
    icon: roleIcons[id],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const dbRole = roleToDbRole[roleKey];
    const { error } = await signUp(email, password, fullName, dbRole, country || undefined);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.signup.successTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t.signup.successSub.replace("{email}", email)}
          </p>
          <Link href="/login" className="inline-block mt-6">
            <Button variant="outline">{t.signup.backToSignIn}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.signup.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.signup.subtitle}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-2.5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.signup.iAm}
            </p>
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRoleKey(r.id);
                  setStep(2);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                  roleKey === r.id
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <r.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {r.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {r.description}
                  </p>
                </div>
              </button>
            ))}
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {t.signup.haveAccount}{" "}
              <Link
                href="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {t.signup.signInLink}
              </Link>
            </p>
          </div>
        ) : step === 2 ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
            >
              ← {roles.find((r) => r.id === roleKey)?.label}
            </button>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Where are you applying from?
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              We&apos;ll personalise your roadmap and show relevant resources.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "China", "India", "South Korea", "Japan",
                "United States", "United Kingdom", "Canada", "Australia",
                "Brazil", "Germany", "Nigeria", "Mexico",
                "Other",
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCountry(c); setStep(3); }}
                  className={cn(
                    "px-3 py-2.5 rounded-xl border text-sm text-left transition-all",
                    country === c
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full text-center text-xs text-gray-400 dark:text-gray-500 hover:underline mt-2"
            >
              Skip for now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
            >
              {t.signup.changeRole} ({roles.find((r) => r.id === roleKey)?.label}{country ? ` · ${country}` : ""})
            </button>

            <Input
              id="fullName"
              label={t.signup.fullName}
              placeholder={t.signup.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              id="email"
              label={t.signup.email}
              type="email"
              placeholder={t.signup.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label={t.signup.password}
              type="password"
              placeholder={t.signup.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.signup.creating : t.signup.create}
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t.signup.haveAccount}{" "}
              <Link
                href="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {t.signup.signInLink}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
