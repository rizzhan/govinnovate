import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ClipboardCheck } from "lucide-react";
import { getTemplates } from "@/lib/data";
import MarketingNav from "@/components/MarketingNav";
import TemplatesBrowser, { type TemplateRow } from "@/components/templates/TemplatesBrowser";

export default function TemplatesPage() {
  const rows = getTemplates();
  const templates: TemplateRow[] = rows.map((t) => ({
    id: Number(t.id),
    title: String(t.title ?? ""),
    category: String(t.category ?? "General"),
    description: String(t.description ?? ""),
    content: String(t.content ?? ""),
    icon: String(t.icon ?? "file-text"),
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fog-blob left-[-8%] top-[-10%] h-[480px] w-[480px] bg-accent/25" />
      <div className="fog-blob right-[-6%] top-[30%] h-[420px] w-[420px] bg-violet/22" />

      <MarketingNav />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-12">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur dark:border-white/10 dark:bg-white/5">
            Resource library
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
            Standard Templates
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2">
            Ready-to-use templates for every stage of the innovation procurement pathway — from defining
            outcome-based challenges to evaluating startups, structuring pilots, managing risk, and
            scaling validated solutions.
          </p>
        </div>

        <div className="mt-10">
          <TemplatesBrowser templates={templates} />
        </div>

        <section className="mt-16 grid gap-8 rounded-[1.75rem] border border-black/5 bg-white/60 p-7 sm:p-9 lg:grid-cols-2 dark:border-white/10 dark:bg-white/5" aria-label="About this library">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              One library for the entire journey
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              Every template maps to a stage of the procurement lifecycle — challenge, evaluation, pilot,
              compliance, procurement, scale — so departments, evaluators and startups always work from
              the same playbook.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
            >
              How the mechanism works
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="space-y-3.5">
            {[
              { icon: Building2, title: "For departments", desc: "Frame challenges, run pilots and procure on evidence." },
              { icon: ClipboardCheck, title: "For evaluators", desc: "Score every solution on the same transparent rubric." },
              { icon: BadgeCheck, title: "For startups", desc: "Know exactly what is expected — eligibility to payment." },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <li key={r.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{r.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink-3">{r.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <footer className="relative z-10 border-t border-black/5 py-10 text-center text-sm text-ink-3 dark:border-white/5">
        GovInnovate · Smart India Hackathon 2026
      </footer>
    </div>
  );
}