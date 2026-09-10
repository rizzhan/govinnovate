import { ArrowRight, FlaskConical, Plus, Radar, Rocket, Target } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getChallenges, getApplications, getPilots } from "@/lib/data";
import { ButtonLink, Card, StatCard, EmptyState, StatusBadge, SubmitButton } from "@/components/ui";
import {
  applicationStatusLabels,
  applicationStatusTone,
  challengeStatusLabels,
  formatDate,
  formatINR,
  pilotStatusLabels,
  pilotStatusTone,
} from "@/lib/format";
import PipelineVisual from "@/components/PipelineVisual";
import {
  challengeStatusIcon,
  applicationStatusIcon,
  pilotStatusIcon,
} from "@/components/status";
import { publishChallenge, deleteChallenge } from "@/lib/actions/domain";

export default async function GovDashboard() {
  const user = await requireRole(["government"]);
  const challenges = getChallenges({ by: user.id });
  const applications = getApplications();
  const pilots = getPilots();

  const openChallenges = challenges.filter((c) => c.status === "open").length;
  const activePilots = pilots.filter((p) => p.status === "active" || p.status === "design" || p.status === "scaling").length;
  const scaling = challenges.filter((c) => c.status === "scaling").length;
  const totalBudget = pilots.reduce((sum, p) => sum + Number(p.budget || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-2">
            {user.department} · Innovation Procurement Pipeline
          </p>
        </div>
        <ButtonLink href="/gov/challenges/new">
          <Plus className="h-4 w-4" aria-hidden />
          New Challenge
        </ButtonLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Challenges" value={challenges.length} icon={Target} />
        <StatCard label="Open for Applications" value={openChallenges} icon={Radar} accent="bg-violet/10 text-violet" />
        <StatCard label="Pilots Running" value={activePilots} icon={FlaskConical} accent="bg-pending/15 text-[#9a4a00]" />
        <StatCard label="Scaling Solutions" value={scaling} icon={Rocket} accent="bg-verified/15 text-[#1f8a3d]" />
      </div>

      <Card title="Pipeline Status">
        <p className="mb-4 text-xs text-ink-3">
          Active pipeline across {challenges.length} challenges. Commitments contracted so far:{" "}
          <span className="font-semibold text-ink">{formatINR(totalBudget)}</span> in pilot value.
        </p>
        <PipelineVisual currentStatus={challenges.length ? "open" : "draft"} />
      </Card>

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">Your Challenges</h2>
          <p className="text-sm text-ink-2">Frame outcomes, publish, run pilots and scale on evidence.</p>
        </div>
        {challenges.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No challenges yet"
            body="Create your first outcome-based challenge to invite innovative startups."
          />
        ) : (
          <div className="space-y-3">
            {challenges.map((c) => {
              const info = challengeStatusLabels[c.status] ?? { label: c.status, tone: "neutral" as const };
              const counts = applications.filter((a) => a.challenge_id === c.id);
              return (
                <div key={c.id} className="glass lift rounded-3xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-semibold text-ink">{c.title}</h3>
                        <StatusBadge tone={info.tone} icon={challengeStatusIcon[c.status]}>
                          {info.label}
                        </StatusBadge>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-2">
                        {c.sector} · Budget {formatINR(c.budget_min)} – {formatINR(c.budget_max)} · Created {formatDate(c.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {c.status === "draft" && (
                        <form action={publishChallenge}>
                          <input type="hidden" name="id" value={c.id} />
                          <SubmitButton variant="secondary" size="sm">Publish</SubmitButton>
                        </form>
                      )}
                      {c.status === "draft" && (
                        <form action={deleteChallenge}>
                          <input type="hidden" name="id" value={c.id} />
                          <SubmitButton variant="danger" size="sm">Delete</SubmitButton>
                        </form>
                      )}
                      {c.status === "open" && (
                        <ButtonLink href={`/gov/applications?challenge=${c.id}`} variant="secondary" size="sm">
                          Applications ({counts.length})
                        </ButtonLink>
                      )}
                      {(c.status === "piloting" || c.status === "scaling") && (
                        <ButtonLink href={`/gov/pilots?challenge=${c.id}`} variant="secondary" size="sm">
                          Pilot
                        </ButtonLink>
                      )}
                      <ButtonLink href={`/gov/challenges/${c.id}`} variant="ghost" size="sm">
                        View
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </ButtonLink>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-ink-2">{c.outcome_statement}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Recent Applications">
          {applications.length === 0 ? (
            <p className="text-sm text-ink-2">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {applications.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{a.startup_name}</p>
                    <p className="truncate text-xs text-ink-2">{a.challenge_title}</p>
                  </div>
                  <StatusBadge tone={applicationStatusTone[a.status] ?? "neutral"} icon={applicationStatusIcon[a.status]}>
                    {applicationStatusLabels[a.status] ?? a.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Active Pilots">
          {pilots.length === 0 ? (
            <p className="text-sm text-ink-2">No pilots yet.</p>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {pilots.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                    <p className="truncate text-xs text-ink-2">
                      {p.startup_name} · {formatINR(p.budget)}
                    </p>
                  </div>
                  <StatusBadge tone={pilotStatusTone[p.status] ?? "neutral"} icon={pilotStatusIcon[p.status]}>
                    {pilotStatusLabels[p.status] ?? p.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}