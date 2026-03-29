"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft, X } from "lucide-react";

const categories = [
  { slug: "general", name: "General" },
  { slug: "essays", name: "Essays" },
  { slug: "financial-aid", name: "Financial Aid" },
  { slug: "international", name: "International" },
  { slug: "test-prep", name: "Test Prep" },
];

interface UniversityOption {
  name: string;
  slug: string;
}

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  // School tagging state
  const [schoolInput, setSchoolInput] = useState("");
  const [schoolTags, setSchoolTags] = useState<string[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<UniversityOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<UniversityOption[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("forum_categories").select("id, slug");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((c) => (map[c.slug] = c.id));
        setCategoryMap(map);
      }
    };
    const fetchSchools = async () => {
      const { data } = await supabase
        .from("universities")
        .select("name, slug")
        .order("name");
      if (data) setSchoolOptions(data);
    };
    fetchCategories();
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter school autocomplete
  useEffect(() => {
    if (schoolInput.length < 2) {
      setFilteredOptions([]);
      return;
    }
    const lower = schoolInput.toLowerCase();
    setFilteredOptions(
      schoolOptions
        .filter(
          (s) =>
            s.name.toLowerCase().includes(lower) &&
            !schoolTags.includes(s.slug)
        )
        .slice(0, 6)
    );
  }, [schoolInput, schoolOptions, schoolTags]);

  const addSchoolTag = (slug: string) => {
    if (!schoolTags.includes(slug)) {
      setSchoolTags((prev) => [...prev, slug]);
    }
    setSchoolInput("");
    setFilteredOptions([]);
  };

  const removeSchoolTag = (slug: string) => {
    setSchoolTags((prev) => prev.filter((s) => s !== slug));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);

    const { data, error: insertError } = await supabase
      .from("forum_posts")
      .insert({
        author_id: user.id,
        category_id: categoryMap[categorySlug] || null,
        title: title.trim(),
        content: content.trim(),
        school_tags: schoolTags.length > 0 ? schoolTags : null,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else if (data) {
      router.push(`/community/post/${data.id}`);
    }
  };

  // Build a slug→name map for display
  const slugToName = Object.fromEntries(
    schoolOptions.map((s) => [s.slug, s.name])
  );

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to community
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create a post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <Input
          id="title"
          label="Title"
          placeholder="What's your question or topic?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or experience..."
            rows={8}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />
        </div>

        {/* School tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tag schools <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            Tag relevant universities so your post shows up on their school page.
          </p>

          {/* Selected tags */}
          {schoolTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {schoolTags.map((slug) => (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm"
                >
                  {slugToName[slug] ?? slug}
                  <button
                    type="button"
                    onClick={() => removeSchoolTag(slug)}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Autocomplete input */}
          <div className="relative">
            <input
              type="text"
              value={schoolInput}
              onChange={(e) => setSchoolInput(e.target.value)}
              placeholder="Type a university name..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {filteredOptions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-lg py-1 z-20">
                {filteredOptions.map((opt) => (
                  <button
                    key={opt.slug}
                    type="button"
                    onClick={() => addSchoolTag(opt.slug)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/community">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={!title.trim() || !content.trim() || submitting}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
