import { ArrowRight, Compass, FlaskConical, Inbox, Target, Wallet } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getChallenges, getApplications, getPilots, getMilestones, getStartupProfile } from "@/lib/data";
import { ButtonLink, Card, StatCard } from "@/components/ui";
import { formatDate, formatINR } from "@/lib/format";

export default async function StartupDashboard() {
  const user = await requireRole(["startup"]);
  const profile = await getStartupProfile(user.id);
  const challenges = await getChallenges();
  const openChallenges = challenges.filter((c) => c.status === "open");
  const apps = await getApplications({ startupUserId: user.id });
  const pilots = await getPilots({ startupUserId: user.id });
  const msByPilot = new Map<number, Awaited<ReturnType<typeof getMilestones>>>(
    await Promise.all(pilots.map(async (p) => [p.id, await getMilestones(p.id)] as const))
  );

  const lifetime = pilots.reduce(
    (acc, p) => {
      const ms = msByPilot.get(p.id) ?? [];
      acc.contracted += Number(p.budget || 0);
      acc.received += ms.reduce((s, m) => s + (m.status === "paid" ? Number(m.amount) : 0), 0);
      return acc;
    },
    { contracted: 0, received: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-ink-2">
            {profile?.company_name || user.org} · DPIIT-approved pathway · No prior-turnover barrier
          </p>
        </div>
        <ButtonLink href="/startup/challenges">
          <Compass className="h-4 w-4" aria-hidden />
          Browse Open Challenges
        </ButtonLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Challenges" value={openChallenges.length} icon={Target} />
        <StatCard label="Applications" value={apps.length} icon={Inbox} accent="bg-accent/10 text-accent" />
        <StatCard label="Pilots" value={pilots.length} icon={FlaskConical} accent="bg-violet/10 text-violet" />
        <StatCard label="Payments Received" value={formatINR(lifetime.received)} icon={Wallet} accent="bg-verified/15 text-[#1f8a3d]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Open Challenges for Your Sector">
          {openChallenges.length === 0 ? (
            <p className="text-sm text-ink-2">No challenges currently open for applications.</p>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {openChallenges.slice(0, 5).map((c) => (
                <li key={c.id} className="py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{c.title}</p>
                      <p className="truncate text-xs text-ink-2">
                        {c.department} · {formatINR(c.budget_min)} – {formatINR(c.budget_max)}
                      </p>
                    </div>
                    <ButtonLink href={`/startup/challenges/${c.id}`} variant="ghost" size="sm">
                      Apply
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </ButtonLink>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Active Pilot Milestones">
          {pilots.length === 0 ? (
            <p className="text-sm text-ink-2">No pilots yet — apply to open challenges to get started.</p>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {pilots.map((p) => (
                <li key={p.id} className="py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                      <p className="truncate text-xs text-ink-2">
                        Contracted {formatINR(p.budget)} · Ends {formatDate(p.end_date)}
                      </p>
                    </div>
                    <ButtonLink href={`/startup/pilots/${p.id}`} variant="ghost" size="sm">
                      Track
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </ButtonLink>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}