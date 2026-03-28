"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap, LogOut, Globe, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { type Locale, localeLabels } from "@/i18n/translations";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { locale, setLocale, t } = useLanguage();

  const navigation = [
    { name: t.nav.community, href: "/community" },
    { name: t.nav.roadmap, href: "/roadmap" },
    { name: t.nav.schools, href: "/schools" },
    { name: t.nav.resources, href: "/resources" },
    { name: t.nav.forParents, href: "/parents" },
  ];

  const locales = Object.keys(localeLabels) as Locale[];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Entora
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side: language switcher + auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{localeLabels[locale]}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-lg py-1 z-50">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocale(l); setLangOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors",
                        l === locale
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {localeLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.full_name || user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  title={t.nav.signOut}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t.nav.signIn}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">{t.nav.getStarted}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200",
            mobileMenuOpen ? "max-h-[32rem] pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile language selector */}
            <div className="flex flex-wrap gap-1.5 px-3 pt-2 pb-1">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                    l === locale
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                  )}
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                >
                  {t.nav.signOut}
                </Button>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      {t.nav.signIn}
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button size="sm" className="w-full">
                      {t.nav.getStarted}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Close lang dropdown on outside click */}
      {langOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLangOpen(false)}
        />
      )}
    </header>
  );
}
