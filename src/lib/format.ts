export type StatusTone = "neutral" | "info" | "violet" | "success" | "warning" | "danger";

export const roleLabels: Record<string, string> = {
  admin: "Admin",
  government: "Government",
  startup: "Startup",
  evaluator: "Evaluator",
};

export const challengeStatusLabels: Record<string, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "neutral" },
  open: { label: "Open for Applications", tone: "info" },
  evaluate: { label: "Under Evaluation", tone: "warning" },
  piloting: { label: "Piloting", tone: "violet" },
  scaling: { label: "Scaling", tone: "success" },
  completed: { label: "Completed", tone: "neutral" },
};

export const applicationStatusLabels: Record<string, string> = {
  submitted: "Submitted",
  shortlisted: "Shortlisted",
  rejected: "Not Shortlisted",
  selected: "Selected for Pilot",
  withdrawn: "Withdrawn",
};

export const applicationStatusTone: Record<string, StatusTone> = {
  submitted: "neutral",
  shortlisted: "info",
  selected: "success",
  rejected: "danger",
  withdrawn: "neutral",
};

export const pilotStatusLabels: Record<string, string> = {
  design: "Pilot Design",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  scaling: "Scaling",
};

export const pilotStatusTone: Record<string, StatusTone> = {
  design: "info",
  active: "violet",
  paused: "warning",
  completed: "success",
  scaling: "success",
};

export const milestoneStatusLabels: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
  paid: "Paid",
};

export const milestoneStatusTone: Record<string, StatusTone> = {
  pending: "neutral",
  verified: "warning",
  paid: "success",
};

export const scaleDecisionLabels: Record<string, string> = {
  scale: "Scale up",
  in_progress: "In progress",
  trial: "Extend pilot",
  not_scale: "Do not scale",
  pending: "Pending",
};

export function formatINR(amount: number | null | undefined): string {
  const n = amount ?? 0;
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function formatDate(d: string | null | undefined): string {
  if (!d) return "-";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}