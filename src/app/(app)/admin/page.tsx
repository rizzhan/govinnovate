import {
  Building2,
  FileText,
  FlaskConical,
  Inbox,
  Landmark,
  Layers,
  Radar,
  ClipboardCheck,
  Rocket,
  CheckCircle2,
  Target,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getStats, getChallenges, getPilots } from "@/lib/data";
import { ButtonLink, Card, StatCard } from "@/components/ui";
import { challengeStatusLabels, formatINR } from "@/lib/format";
import { challengeStatusIcon } from "@/components/status";

const lifecycle = [
  { icon: Target, label: "Challenge" },
  { icon: Radar, label: "Discovery" },
  { icon: Layers, label: "Screening" },
  { icon: ClipboardCheck, label: "Evaluation" },
  { icon: FlaskConical, label: "Pilot" },
  { icon: CheckCircle2, label: "Payment" },
  { icon: Rocket, label: "Evidence-Based Scale" },
];

export default async function AdminDashboard() {
  await requireRole(["admin"]);
  const stats = await getStats();
  const challenges = await getChallenges();
  const pilots = await getPilots();
  const totalPilotValue = pilots.reduce((s, p) => s + Number(p.budget || 0), 0);

  const statusCounts = challenges.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Platform Overview</h1>
        <p className="mt-1 text-sm text-ink-2">
          Admin view of the innovation procurement network across departments, startups and evaluators.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Challenges" value={stats.challenges} icon={Target} />
        <StatCard label="Applications" value={stats.applications} icon={Inbox} accent="bg-accent/10 text-accent" />
        <StatCard label="Pilots" value={stats.pilots} icon={FlaskConical} accent="bg-violet/10 text-violet" />
        <StatCard label="Startups" value={stats.startups} icon={Building2} accent="bg-verified/15 text-[#1f8a3d]" />
        <StatCard label="Templates" value={stats.templates} icon={FileText} accent="bg-pending/15 text-[#9a4a00]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pipeline Distribution">
          <div className="space-y-3">
            {["draft", "open", "evaluate", "piloting", "scaling", "completed"].map((s) => {
              const info = challengeStatusLabels[s];
              const count = statusCounts[s] || 0;
              const pct = challenges.length ? Math.round((count / challenges.length) * 100) : 0;
              const Icon = challengeStatusIcon[s] ?? FileText;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-ink">
                      <Icon className="h-3.5 w-3.5 text-ink-3" aria-hidden />
                      {info.label}
                    </span>
                    <span className="font-medium text-ink">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-ink/10">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="Platform Health">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-ink/5 px-3 py-2">
              <span className="text-ink-2">Pilot value contracted</span>
              <b className="text-ink">{formatINR(totalPilotValue)}</b>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-ink/5 px-3 py-2">
              <span className="text-ink-2">Applications</span>
              <b className="text-ink">{stats.applications}</b>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-ink/5 px-3 py-2">
              <span className="text-ink-2">Standard templates live</span>
              <b className="text-ink">{stats.templates}</b>
            </div>
            <p className="pt-2 text-xs text-ink-3">GovInnovate tracks the full lifecycle:</p>
            <div className="flex flex-wrap gap-2">
              {lifecycle.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink-2">
                  <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/admin/users">
          <Users className="h-4 w-4" aria-hidden />
          Manage Users & Roles
        </ButtonLink>
        <ButtonLink href="/admin/templates" variant="secondary">
          <Landmark className="h-4 w-4" aria-hidden />
          Manage Templates
        </ButtonLink>
      </div>
    </div>
  );
}