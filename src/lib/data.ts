import { col } from "./db";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  outcome_statement: string;
  department: string;
  sector: string;
  budget_min: number;
  budget_max: number;
  status: string;
  timeline: string;
  created_by: number;
  created_at: string;
};

export type Application = {
  id: number;
  challenge_id: number;
  startup_user_id: number;
  solution_summary: string;
  tech_readiness: string;
  differentiator: string;
  ask_amount: number;
  status: string;
  submitted_at: string;
};

export type ApplicationListItem = Application & {
  challenge_title: string;
  startup_name: string;
  department: string;
};

export type ApplicationDetail = Application & {
  challenge_title: string;
  department: string;
  startup_name: string;
  startup_email: string;
  startup_org: string;
  startup_designation: string;
};

/** Converts a {_id, ...rest} Mongo doc to the {id, ...rest} app shape. */
function shaped<T>(doc: Record<string, any> | null | undefined): T | undefined {
  if (!doc) return undefined;
  const { _id, ...rest } = doc;
  return { id: _id, ...rest } as T;
}

export async function getChallenges(opts?: { by?: number; status?: string }) {
  const challenges = await col<Challenge>("challenges");
  const q: Record<string, any> = {};
  if (opts?.by) q.created_by = opts.by;
  if (opts?.status) q.status = opts.status;
  const docs = await challenges.find(q).sort({ _id: -1 }).toArray();
  return docs.map((d) => shaped<Challenge>(d) as Challenge);
}

export type ScopeUser = { id: number; department?: string };

/**
 * Department scoping: a government user sees challenges they created plus
 * challenges from their own department. Everyone else is fenced out.
 */
export async function getScopedChallengeIds(user: ScopeUser): Promise<number[]> {
  const challenges = await col<Challenge>("challenges");
  const or: Record<string, any>[] = [{ created_by: user.id }];
  if (user.department) or.push({ department: user.department });
  const docs = await challenges.find({ $or: or }).project({ _id: 1 }).toArray();
  return docs.map((d) => d._id as number);
}

export function isChallengeVisible(
  user: ScopeUser,
  c: { created_by: number; department: string }
): boolean {
  return c.created_by === user.id || (!!user.department && c.department === user.department);
}

export async function getChallenge(id: number) {
  const challenges = await col<Challenge>("challenges");
  return shaped<Challenge>(await challenges.findOne({ _id: id }));
}

export async function getApplications(opts?: { challengeId?: number; challengeIds?: number[]; startupUserId?: number; status?: string }) {
  const applications = await col<Application>("applications");
  const q: Record<string, any> = {};
  if (opts?.challengeId) q.challenge_id = opts.challengeId;
  else if (opts?.challengeIds) q.challenge_id = { $in: opts.challengeIds };
  if (opts?.startupUserId) q.startup_user_id = opts.startupUserId;
  if (opts?.status) q.status = opts.status;
  const apps = await applications.find(q).sort({ _id: -1 }).toArray();
  if (apps.length === 0) return [];
  const challengeIds = [...new Set(apps.map((a) => a.challenge_id))];
  const userIds = [...new Set(apps.map((a) => a.startup_user_id))];
  const [challenges, users] = await Promise.all([
    (await col<Challenge>("challenges")).find({ _id: { $in: challengeIds } }).toArray(),
    (await col("users")).find({ _id: { $in: userIds } }).project({ name: 1 }).toArray(),
  ]);
  const cMap = new Map<number, Challenge>(challenges.map((c) => [c._id, c]));
  const uMap = new Map<number, any>(users.map((u) => [u._id, u]));
  return apps.map((a): ApplicationListItem => {
    const c = cMap.get(a.challenge_id);
    const u = uMap.get(a.startup_user_id);
    const { _id } = a;
    const fields = { ...a } as unknown as Omit<Application, "id">;
    return {
      ...fields,
      id: _id,
      challenge_title: c?.title ?? "",
      startup_name: u?.name ?? "",
      department: c?.department ?? "",
    };
  });
}

export async function getApplication(id: number) {
  const applications = await col<Application>("applications");
  const a = await applications.findOne({ _id: id });
  if (!a) return undefined;
  const [c, u] = await Promise.all([
    (await col<Challenge>("challenges")).findOne({ _id: a.challenge_id }),
    (await col("users")).findOne({ _id: a.startup_user_id }),
  ]);
  const { _id } = a;
  const fields = { ...a } as unknown as Omit<Application, "id">;
  return {
    ...fields,
    id: _id,
    challenge_title: c?.title ?? "",
    department: c?.department ?? "",
    startup_name: u?.name ?? "",
    startup_email: u?.email ?? "",
    startup_org: u?.org ?? "",
    startup_designation: u?.designation ?? "",
  };
}

export async function getEvaluationsForApplication(applicationId: number) {
  const evaluations = await col("evaluations");
  const evals = await evaluations.find({ application_id: applicationId }).toArray();
  if (evals.length === 0) return [];
  const userIds = [...new Set(evals.map((e) => e.evaluator_user_id))];
  const users = await (await col("users"))
    .find({ _id: { $in: userIds } })
    .project({ name: 1, org: 1 })
    .toArray();
  const uMap = new Map<number, any>(users.map((u) => [u._id, u]));
  return evals.map((e) => {
    const u = uMap.get(e.evaluator_user_id);
    const { _id, ...rest } = e;
    return { id: _id, ...rest, evaluator_name: u?.name ?? "", evaluator_org: u?.org ?? "" };
  }) as (Record<string, any> & { evaluator_name: string })[];
}

export async function getPilots(opts?: { startupUserId?: number; challengeId?: number; challengeIds?: number[] }) {
  const pilots = await col("pilots");
  const q: Record<string, any> = {};
  if (opts?.startupUserId) q.startup_user_id = opts.startupUserId;
  if (opts?.challengeId) q.challenge_id = opts.challengeId;
  else if (opts?.challengeIds) q.challenge_id = { $in: opts.challengeIds };
  const docs = await pilots.find(q).sort({ _id: -1 }).toArray();
  if (docs.length === 0) return [];
  const challengeIds = [...new Set(docs.map((p) => p.challenge_id))];
  const userIds = [...new Set(docs.map((p) => p.startup_user_id))];
  const [challenges, users] = await Promise.all([
    (await col<Challenge>("challenges")).find({ _id: { $in: challengeIds } }).toArray(),
    (await col("users")).find({ _id: { $in: userIds } }).project({ name: 1 }).toArray(),
  ]);
  const cMap = new Map<number, any>(challenges.map((c) => [c._id, c]));
  const uMap = new Map<number, any>(users.map((u) => [u._id, u]));
  return docs.map((p) => {
    const { _id, ...rest } = p;
    return {
      id: _id,
      ...rest,
      challenge_title: cMap.get(p.challenge_id)?.title ?? "",
      department: cMap.get(p.challenge_id)?.department ?? "",
      startup_name: uMap.get(p.startup_user_id)?.name ?? "",
    };
  }) as (Record<string, any> & { challenge_title: string; startup_name: string })[];
}

export async function getPilot(id: number) {
  const pilots = await col("pilots");
  const p = await pilots.findOne({ _id: id });
  if (!p) return undefined;
  const [c, u] = await Promise.all([
    (await col<Challenge>("challenges")).findOne({ _id: p.challenge_id }),
    (await col("users")).findOne({ _id: p.startup_user_id }),
  ]);
  const { _id, ...rest } = p;
  return {
    id: _id,
    ...rest,
    challenge_title: c?.title ?? "",
    department: c?.department ?? "",
    startup_name: u?.name ?? "",
    startup_email: u?.email ?? "",
  } as Record<string, any>;
}

export async function getMilestones(pilotId: number) {
  const milestones = await col("milestones");
  const docs = await milestones.find({ pilot_id: pilotId }).sort({ _id: 1 }).toArray();
  return docs.map((d) => shaped<Record<string, any>>(d) as Record<string, any>);
}

export async function getScaleUpDecision(pilotId: number) {
  const decisions = await col("scale_up_decisions");
  const docs = await decisions.find({ pilot_id: pilotId }).sort({ _id: -1 }).limit(1).toArray();
  return shaped<Record<string, any>>(docs[0]);
}

export async function getStartupProfile(userId: number) {
  const profiles = await col("startup_profiles");
  return shaped<Record<string, any>>(await profiles.findOne({ user_id: userId }));
}

export async function getAttachments(startupUserId: number) {
  const attachments = await col("startup_attachments");
  const docs = await attachments.find({ startup_user_id: startupUserId }).sort({ _id: 1 }).toArray();
  return docs.map((d) => shaped<Record<string, any>>(d) as Record<string, any>);
}

export async function getTemplates() {
  const templates = await col("templates");
  const docs = await templates.find({}).sort({ category: 1, _id: 1 }).toArray();
  return docs.map((d) => shaped<Record<string, any>>(d) as Record<string, any>);
}

export async function getTemplate(id: number) {
  const templates = await col("templates");
  return shaped<Record<string, any>>(await templates.findOne({ _id: id }));
}

export async function getAllUsers() {
  const users = await col("users");
  const docs = await users
    .find({})
    .project({ name: 1, email: 1, role: 1, org: 1, department: 1 })
    .sort({ _id: 1 })
    .toArray();
  return docs.map((d) => shaped<Record<string, any>>(d) as Record<string, any>);
}

export async function getStats() {
  const [challenges, applications, pilots, users, templates] = await Promise.all([
    col("challenges"),
    col("applications"),
    col("pilots"),
    col("users"),
    col("templates"),
  ]);
  const [c, a, p, s, t] = await Promise.all([
    challenges.countDocuments(),
    applications.countDocuments(),
    pilots.countDocuments(),
    users.countDocuments({ role: "startup" }),
    templates.countDocuments(),
  ]);
  return { challenges: c, applications: a, pilots: p, startups: s, templates: t };
}
