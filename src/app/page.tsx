import Link from "next/link";
import { BadgeCheck, Gauge, ShieldCheck, Stamp, TrendingUp } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import {
  getAllUsers,
  getApplications,
  getChallenges,
  getEvaluationsForApplication,
  getMilestones,
  getPilots,
  getScaleUpDecision,
  getStats,
  getTemplates,
} from "@/lib/data";
import Lifecycle from "@/components/landing/Lifecycle";
import {
  FinalCTA,
  FlowStrip,
  Funnel,
  Journeys,
  Roles,
  SectionHeading,
  TemplatesBand,
  Transparency,
  type LandingStats,
} from "@/components/landing/Sections";
import {
  DashboardPreview,
  EvaluationPreview,
  PilotPreview,
  type EvalRecord,
  type KpiRow,
} from "@/components/landing/Previews";

export default async function LandingPage() {
  const raw = getStats();
  const challenges = getChallenges();
  const applications = getApplications();
  const pilots = getPilots();
  const allUsers = getAllUsers();
  const templates = getTemplates();

  const eligible = applications.filter((a) => a.status !== "rejected" && a.status !== "withdrawn").length;
  const scaled = challenges.filter((c) => c.status === "scaling").length;
  const openChallenges = challenges.filter((c) => c.status === "open").length;

  let paidMilestones = 0;
  for (const p of pilots) {
    paidMilestones += getMilestones(p.id).filter((m) => m.status === "paid").length;
  }

  const stats: LandingStats = {
    challenges: raw.challenges,
    applications: raw.applications,
    eligible,
    startups: raw.startups,
    pilots: raw.pilots,
    scaled,
    openChallenges,
    paidMilestones,
    pendingEvaluations: applications.filter((a) => a.status === "submitted").length,
    users: allUsers.length,
    templates: templates.length,
  };

  const totalContracted = pilots.reduce((s, p) => s + Number(p.budget || 0), 0);

  const pilot = pilots[0];
  const milestones = pilot ? getMilestones(pilot.id) : [];
  const scaleDecision = pilot ? getScaleUpDecision(pilot.id) : undefined;
  const paidTotal = milestones.reduce((s, m) => s + (m.status === "paid" ? Number(m.amount) : 0), 0);
  const verifiedTotal = milestones.filter((m) => m.status === "verified").length;

  let evalRecord: EvalRecord | null = null;
  if (pilot) {
    const evals = getEvaluationsForApplication(pilot.application_id);
    const e = evals[0];
    if (e) {
      const scores = [e.innovation_score, e.feasibility_score, e.impact_score, e.scalability_score, e.viability_score].map(Number);
      const valid = scores.filter((n) => Number.isFinite(n));
      if (valid.length === scores.length) {
        evalRecord = {
          criteria: [
            { label: "Innovation & novelty", score: scores[0] },
            { label: "Feasibility & readiness", score: scores[1] },
            { label: "Expected impact", score: scores[2] },
            { label: "Scalability", score: scores[3] },
            { label: "Cost & viability", score: scores[4] },
          ],
          average: scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
          evaluator: e.evaluator_name ?? "Independent evaluator",
          org: e.evaluator_org ?? "",
          recommendation: e.recommendation ?? "",
          comment: e.comments ?? "",
        };
      }
    }
  }

  const kpis: KpiRow[] = [
    { kpi: "Sensor uptime", target: "95%", actual: "96%", onTrack: true },
    { kpi: "Alert time", target: "≤ 15 min", actual: "< 12 min", onTrack: true },
    { kpi: "Coverage", target: "5 lakes", actual: "5 lakes", onTrack: true },
  ];

  const transparencyRecord = evalRecord && pilot
    ? [
        { icon: BadgeCheck, label: "Eligibility", value: "Verified", tone: "success" as const },
        { icon: Gauge, label: "Technical score", value: `${Math.round(evalRecord.average * 10)} / 100`, tone: "success" as const },
        { icon: TrendingUp, label: "Pilot performance", value: "96%", tone: "success" as const },
        { icon: ShieldCheck, label: "Independent validation", value: "Complete", tone: "success" as const },
        { icon: Stamp, label: "Procurement recommendation", value: "Scale recommended", tone: "success" as const },
      ]
    : null;

  const provenance =
    evalRecord && pilot
      ? `Live values from the demo workspace — evaluation record and pilot validation notes for “${pilot.title}”.`
      : "Demo workspace not loaded yet — sign in to populate records.";

  return (
    <div className="relative overflow-hidden">
      <div className="fog-blob left-[-8%] top-[-10%] h-[520px] w-[520px] bg-accent/25" />
      <div className="fog-blob right-[-6%] top-[16%] h-[440px] w-[440px] bg-violet/22" />

      {/* Glass nav */}
      <MarketingNav />

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-1.5 text-xs font-medium text-accent backdrop-blur dark:border-white/10 dark:bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Smart India Hackathon 2026 · Startup Procurement
          </p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
            A startup-friendly pathway from <span className="text-gradient">problem</span> to{" "}
            <span className="text-gradient">government scale</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
            One transparent, competitive and compliant mechanism for departments to identify, pilot, procure
            and scale innovative solutions — and for startups to win time-bound, milestone-paid contracts
            without prior-turnover barriers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="w-full rounded-full bg-accent px-7 py-3 text-center font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_28px_rgba(0,113,227,0.4)] transition-all hover:bg-accent-dark active:scale-[0.98] sm:w-auto"
            >
              Explore the platform
            </Link>
            <Link
              href="/templates"
              className="w-full rounded-full border border-black/10 bg-white/60 px-7 py-3 text-center font-semibold text-ink backdrop-blur transition-colors hover:bg-white active:scale-[0.98] sm:w-auto dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              View standard templates
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <FlowStrip />
        </div>
      </section>

      {/* Procurement lifecycle */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="The mechanism"
            title="Nine stages from problem to scale"
            sub="A single procurement lifecycle with defined hand-offs. Select any stage to see why it exists and which barrier it removes."
          />
          <div className="mt-12">
            <Lifecycle />
          </div>
        </div>
      </section>

      {/* Funnel */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="In practice"
            title="The pipeline, end to end"
            sub="Departments enter with a problem. Startups exit with a scale contract. Every drop-off point is a conscious, auditable decision."
          />
          <div className="mt-12">
            <Funnel />
          </div>
        </div>
      </section>

      {/* Two journeys */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Two sides of the same platform"
            title="Departments publish. Startups respond."
            sub="One mechanism, two workbenches — the same pipeline viewed through each stakeholder’s decisions."
          />
          <div className="mt-14">
            <Journeys />
          </div>
        </div>
      </section>

      {/* Product previews */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Inside the platform"
            title="A real product, not a slide deck"
            sub="Live views from the demo workspace — seeded with walkable figures so every number is traceable in the product."
          />
          <div className="mt-12 grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <DashboardPreview stats={stats} totalContracted={totalContracted} />
            <div className="space-y-5">
              <EvaluationPreview record={evalRecord} />
              <PilotPreview
                title={pilot ? pilot.title : "Pilot · KPIs"}
                kpis={kpis}
                paidValue={paidTotal}
                verifiedValue={verifiedTotal}
                scaleNote={scaleDecision?.validation_notes}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four roles */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Built for four roles"
            title="One platform, four workbenches"
            sub="Each role opens into its own workspace — with the same evidence underneath."
          />
          <div className="mt-12">
            <Roles stats={stats} />
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Trust by design"
            title="Transparency, demonstrated"
            sub="Eligibility, scoring, pilot performance, validation and the final recommendation — visible at every stage."
          />
          <div className="mt-12">
            <Transparency record={transparencyRecord} provenance={provenance} />
          </div>
        </div>
      </section>

      {/* Templates / compliance */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <TemplatesBand />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <FinalCTA />
        </div>
      </section>

      <footer className="relative z-10 border-t border-black/5 py-10 text-center text-sm text-ink-3 dark:border-white/5">
        GovInnovate · Smart India Hackathon 2026 · Startup-friendly Public Procurement Mechanism
      </footer>
    </div>
  );
}