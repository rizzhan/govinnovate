import Link from "next/link";
import { BadgeCheck, Gauge, ShieldCheck, Stamp, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import {
  getAllUsers,
  getApplication,
  getApplications,
  getChallenges,
  getEvaluationsForApplication,
  getMilestones,
  getPilots,
  getScaleUpDecision,
  getStats,
  getTemplates,
} from "@/lib/data";
import { formatINR, scaleDecisionLabels } from "@/lib/format";
import Lifecycle from "@/components/landing/Lifecycle";
import AutoRefresh from "@/components/landing/AutoRefresh";
import Reveal from "@/components/Reveal";
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

// Database-backed: always render fresh (and never query at build time).
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const raw = await getStats();
  const challenges = await getChallenges();
  const applications = await getApplications();
  const pilots = await getPilots();
  const allUsers = await getAllUsers();
  const templates = await getTemplates();

  const eligible = applications.filter((a) => a.status !== "rejected" && a.status !== "withdrawn").length;
  const eligibleStartups = new Set(
    applications
      .filter((a) => a.status !== "rejected" && a.status !== "withdrawn")
      .map((a) => a.startup_user_id)
  ).size;
  const scaled = challenges.filter((c) => c.status === "scaling").length;
  const openChallenges = challenges.filter((c) => c.status === "open").length;

  let paidMilestones = 0;
  for (const p of pilots) {
    paidMilestones += (await getMilestones(p.id)).filter((m) => m.status === "paid").length;
  }

  const stats: LandingStats = {
    challenges: raw.challenges,
    applications: raw.applications,
    eligible,
    eligibleStartups,
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
  const milestones = pilot ? await getMilestones(pilot.id) : [];
  const scaleDecision = pilot ? await getScaleUpDecision(pilot.id) : undefined;
  const paidTotal = milestones.reduce((s, m) => s + (m.status === "paid" ? Number(m.amount) : 0), 0);
  const verifiedTotal = milestones.filter((m) => m.status === "verified").length;

  // Everything below is computed from live records — no display literals.
  const totalTranches = milestones.length;
  const paidCount = milestones.filter((m) => m.status === "paid").length;
  const clearedCount = milestones.filter((m) => m.status === "paid" || m.status === "verified").length;
  const pilotBudget = Number(pilot?.budget || 0);
  const completionPct = totalTranches > 0 ? Math.round((paidCount / totalTranches) * 100) : 0;

  const sourceApplication = pilot ? await getApplication(pilot.application_id) : undefined;
  const pilotChallenge = pilot ? challenges.find((c) => c.id === pilot.challenge_id) : undefined;
  const dashboardSubtitle =
    pilotChallenge?.department ?? challenges[0]?.department ?? "Demo workspace";
  const eligibilityValue = !sourceApplication
    ? "Pending"
    : ["shortlisted", "selected"].includes(sourceApplication.status)
      ? "Verified"
      : "In review";

  const validatedPilotIds = new Set<number>();
  await Promise.all(
    pilots.map(async (p) => {
      if (await getScaleUpDecision(p.id)) validatedPilotIds.add(p.id);
    })
  );

  let evalRecord: EvalRecord | null = null;
  if (pilot) {
    const evals = await getEvaluationsForApplication(pilot.application_id);
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
          applicationStatus: sourceApplication?.status ?? "submitted",
        };
      }
    }
  }

  const kpis: KpiRow[] =
    !pilot || totalTranches === 0
      ? []
      : [
          {
            kpi: "Tranches paid",
            target: `${totalTranches} tranches`,
            actual: `${paidCount} paid`,
            onTrack: paidCount === totalTranches,
          },
          {
            kpi: "Budget released",
            target: formatINR(pilotBudget),
            actual: formatINR(paidTotal),
            onTrack: paidTotal >= pilotBudget,
          },
          {
            kpi: "Independently cleared",
            target: `${totalTranches} tranches`,
            actual: `${clearedCount} cleared`,
            onTrack: clearedCount === totalTranches,
          },
        ];

  const transparencyRecord: { icon: LucideIcon; label: string; value: string; tone: "success" | "neutral" }[] | null =
    evalRecord && pilot
      ? [
          { icon: BadgeCheck, label: "Eligibility", value: eligibilityValue, tone: eligibilityValue === "Verified" ? "success" : "neutral" },
          { icon: Gauge, label: "Technical score", value: `${Math.round(evalRecord.average * 10)} / 100`, tone: "success" },
          { icon: TrendingUp, label: "Milestone completion", value: `${completionPct}%`, tone: completionPct === 100 ? "success" : "neutral" },
          { icon: ShieldCheck, label: "Independent validation", value: scaleDecision ? "Complete" : "Pending", tone: scaleDecision ? "success" : "neutral" },
          { icon: Stamp, label: "Procurement recommendation", value: scaleDecision ? (scaleDecisionLabels[scaleDecision.decision] ?? scaleDecision.decision) : "Pending", tone: scaleDecision ? "success" : "neutral" },
        ]
      : null;

  const funnelSteps = [
    { n: String(stats.challenges), label: "Challenges", sub: "problems framed" },
    { n: String(stats.applications), label: "Applications", sub: "solutions proposed" },
    { n: String(stats.eligible), label: "Eligible applications", sub: "passed screening" },
    { n: String(stats.pilots), label: "Pilots", sub: "under contract" },
    { n: String(validatedPilotIds.size), label: "Validated", sub: "independently measured" },
    { n: String(stats.scaled), label: "Scaled", sub: "districts live" },
  ];

  const provenance =
    evalRecord && pilot
      ? `Live values from the demo workspace — evaluation record and pilot validation notes for “${pilot.title}”.`
      : "Demo workspace not loaded yet — sign in to populate records.";

  return (
    <div className="relative overflow-hidden">
      <AutoRefresh />
      <div className="fog-blob left-[-8%] top-[-10%] h-[520px] w-[520px] bg-accent/25" />
      <div className="fog-blob right-[-6%] top-[16%] h-[440px] w-[440px] bg-amber-400/20" />

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
              className="w-full rounded-full bg-accent px-7 py-3 text-center font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_28px_rgba(180,83,9,0.4)] transition-all hover:bg-accent-dark active:scale-[0.98] sm:w-auto"
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
            <Reveal delay={120}>
              <Lifecycle />
            </Reveal>
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
            <Reveal delay={120}>
              <Funnel steps={funnelSteps} />
            </Reveal>
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
            <Reveal delay={120}>
              <Journeys />
            </Reveal>
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
            <Reveal delay={120} className="h-full">
              <DashboardPreview stats={stats} totalContracted={totalContracted} subtitle={dashboardSubtitle} />
            </Reveal>
            <Reveal delay={220}>
              <div className="space-y-5">
                <EvaluationPreview record={evalRecord} />
                <PilotPreview
                  title={pilot ? pilot.title : "Pilot · KPIs"}
                  status={pilot?.status ?? ""}
                  kpis={kpis}
                  paidValue={paidTotal}
                  verifiedValue={verifiedTotal}
                  scaleNote={scaleDecision?.validation_notes}
                />
              </div>
            </Reveal>
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
            <Reveal delay={120}>
              <Roles stats={stats} />
            </Reveal>
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
            <Reveal delay={120}>
              <Transparency record={transparencyRecord} provenance={provenance} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Templates / compliance */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <TemplatesBand />
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <FinalCTA />
          </Reveal>
        </div>
      </section>

      <footer className="relative z-10 border-t border-black/5 py-10 text-center text-sm text-ink-3 dark:border-white/5">
        GovInnovate · Smart India Hackathon 2026 · Startup-friendly Public Procurement Mechanism
      </footer>
    </div>
  );
}