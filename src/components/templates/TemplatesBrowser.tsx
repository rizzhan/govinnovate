"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileCheck,
  FlaskConical,
  Scale,
  Search,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { templateIcons } from "@/components/template-icons";
import { FileText } from "lucide-react";

export type TemplateRow = {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string;
  icon: string;
};

const CATEGORIES: { name: string; icon: LucideIcon; users: string }[] = [
  { name: "Challenge", icon: Target, users: "Government departments" },
  { name: "Evaluation", icon: ClipboardCheck, users: "Evaluators & departments" },
  { name: "Pilot", icon: FlaskConical, users: "Departments & startups" },
  { name: "Legal & Compliance", icon: Scale, users: "Departments, startups & legal" },
  { name: "Procurement", icon: FileCheck, users: "Procurement teams" },
  { name: "Scale-up", icon: TrendingUp, users: "Departments & leadership" },
];

const STAGES = ["Challenge", "Evaluation", "Pilot", "Compliance", "Procurement", "Scale"] as const;

const stageToCategory: Record<string, string> = {
  Challenge: "Challenge",
  Evaluation: "Evaluation",
  Pilot: "Pilot",
  Compliance: "Legal & Compliance",
  Procurement: "Procurement",
  Scale: "Scale-up",
};

type Status = { label: string; tone: "success" | "info" | "neutral" };

const STATUS: Record<string, Status> = {
  "Expert Evaluation Criteria Scorecard": { label: "Recommended", tone: "success" },
  "Pilot / Sandbox Agreement": { label: "Recommended", tone: "success" },
  "Pilot KPI & Measurement Framework": { label: "Configurable", tone: "info" },
  "Risk Management Framework": { label: "Configurable", tone: "info" },
};

const defaultStatus: Status = { label: "Standard", tone: "neutral" };

function parseSections(content: string): string[] {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^\d+\.\s*\S/.test(l))
    .map((l) => l.replace(/^\d+\.\s*/, ""))
    .slice(0, 8);
}

function usersFor(category: string): string {
  return CATEGORIES.find((c) => c.name === category)?.users ?? "All roles";
}

export default function TemplatesBrowser({ templates }: { templates: TemplateRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);

  const extraCategories = useMemo(
    () => [...new Set(templates.map((t) => t.category))].filter((c) => !CATEGORIES.some((k) => k.name === c)),
    [templates]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [templates, query, category]);

  const groups = useMemo(() => {
    const order = [...CATEGORIES.map((c) => c.name), ...extraCategories];
    return order
      .map((name) => ({ name, items: filtered.filter((t) => t.category === name) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, extraCategories]);

  const openTemplate = openId != null ? (templates.find((t) => t.id === openId) ?? null) : null;

  useEffect(() => {
    if (openId == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openId ]);

  const searchActive = query.trim().length > 0;

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
            className="w-full rounded-full border border-black/10 bg-white/80 py-2.5 pl-10 pr-10 text-sm text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur transition-colors placeholder:text-ink-3 focus:border-accent/50 focus:outline-none focus:ring-4 focus:ring-accent/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/35"
          />
          {searchActive && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
        <p className="shrink-0 text-[13px] text-ink-3 tabular-nums" aria-live="polite">
          {filtered.length} of {templates.length} templates
        </p>
      </div>

      {/* Category filters */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
        {["All", ...CATEGORIES.map((c) => c.name), ...extraCategories].map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(active && c !== "All" ? "All" : c)}
              aria-pressed={active}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 active:scale-[0.97] ${
                active
                  ? "bg-ink text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black"
                  : "bg-black/5 text-ink-2 hover:bg-black/10 hover:text-ink dark:bg-white/10 dark:text-white/65 dark:hover:bg-white/15 dark:hover:text-white"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Stage progression strip */}
      <div className="mt-6 flex items-center gap-1 overflow-x-auto rounded-2xl border border-black/5 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <span className="mr-1 hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3 sm:block">
          Journey
        </span>
        {STAGES.map((s, i) => {
          const target = stageToCategory[s];
          const active = category === target;
          return (
            <span key={s} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => setCategory(active ? "All" : target)}
                aria-pressed={active}
                className={`rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                  active ? "bg-accent/10 text-accent" : "text-ink-3 hover:text-ink dark:hover:text-white"
                }`}
              >
                {s}
              </button>
              {i < STAGES.length - 1 && (
                <ChevronRight className="mx-0.5 h-3.5 w-3.5 shrink-0 text-ink-3/50" aria-hidden />
              )}
            </span>
          );
        })}
      </div>

      {/* Library */}
      <div className="mt-8">
        {groups.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 px-6 py-16 text-center dark:border-white/10">
            <Search className="mx-auto h-7 w-7 text-ink-3" aria-hidden />
            <p className="mt-3 text-[15px] font-semibold tracking-tight text-ink">No templates match</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-2">
              Try a different keyword, or clear the search to browse the full library.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-4 rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Clear search & filters
            </button>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.name} className="mt-10 first:mt-0" aria-label={`${g.name} templates`}>
              <div className="mb-4 flex items-baseline gap-2.5">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink">{g.name}</h2>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-ink-2 dark:bg-white/10 dark:text-white/60">
                  {g.items.length} {g.items.length === 1 ? "template" : "templates"}
                </span>
                <span className="h-px flex-1 bg-black/5 dark:bg-white/10" aria-hidden />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((t) => {
                  const Icon = templateIcons[String(t.icon ?? "file-text").toLowerCase()] ?? FileText;
                  const status = STATUS[t.title] ?? defaultStatus;
                  return (
                    <article
                      key={t.id}
                      className="group flex flex-col rounded-2xl border border-black/5 bg-white/70 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_12px_32px_rgba(16,24,40,0.1)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                        </span>
                        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                      </div>
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                        {t.category}
                      </p>
                      <h3 className="mt-1 font-semibold tracking-tight text-ink">{t.title}</h3>
                      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-2">{t.description}</p>
                      <div className="mt-auto pt-4">
                        <button
                          type="button"
                          onClick={() => setOpenId(t.id)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
                          aria-haspopup="dialog"
                        >
                          <Eye className="h-4 w-4" aria-hidden />
                          View template
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Preview modal */}
      {openTemplate && (
        <TemplatePreview
          key={openTemplate.id}
          template={openTemplate}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function TemplatePreview({ template, onClose }: { template: TemplateRow; onClose: () => void }) {
  const Icon = templateIcons[String(template.icon ?? "file-text").toLowerCase()] ?? FileText;
  const status = STATUS[template.title] ?? defaultStatus;
  const sections = parseSections(template.content ?? "");

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${template.title} preview`}
      onClick={onClose}
    >
      <div
        className="animate-fade-up max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.25)] sm:p-8 dark:border-white/10 dark:bg-[#1c1c1e]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                {template.category}
              </p>
              <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-ink">{template.title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close preview"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-black/5 hover:text-ink active:scale-95 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-ink-2 dark:bg-white/10 dark:text-white/60">
            Best for: {usersFor(template.category)}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">Purpose</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{template.description}</p>
        </div>

        {sections.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">Key sections</p>
            <ol className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {sections.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-black/5 bg-white/70 px-3.5 py-2.5 text-[13px] text-ink-2 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">Preview</p>
          <div className="mt-2.5 max-h-52 overflow-y-auto rounded-2xl border border-black/5 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
            <pre className="whitespace-pre-wrap font-sans text-[13px] leading-6 text-ink-2">
              {template.content}
            </pre>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-ink-3">
            Platform-provided framework — adapt it to departmental needs. Not a statutory document.
          </p>
          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Close
            </button>
            <Link
              href={`/templates/${template.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,113,227,0.3)] transition-all hover:bg-accent-dark active:scale-[0.97]"
            >
              Open full template
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
