import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FilePen,
  FlaskConical,
  Inbox,
  PauseCircle,
  PenLine,
  Radar,
  Rocket,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const challengeStatusIcon: Record<string, LucideIcon> = {
  draft: FilePen,
  open: Radar,
  evaluate: ClipboardCheck,
  piloting: FlaskConical,
  scaling: Rocket,
  completed: CheckCircle2,
};

export const applicationStatusIcon: Record<string, LucideIcon> = {
  submitted: Send,
  shortlisted: ClipboardCheck,
  selected: CheckCircle2,
  rejected: XCircle,
  withdrawn: Inbox,
};

export const pilotStatusIcon: Record<string, LucideIcon> = {
  design: PenLine,
  active: FlaskConical,
  paused: PauseCircle,
  completed: CheckCircle2,
  scaling: Rocket,
};

export const milestoneStatusIcon: Record<string, LucideIcon> = {
  pending: Clock,
  verified: ShieldCheck,
  paid: BadgeCheck,
};