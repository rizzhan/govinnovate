import {
  BadgeCheck,
  ClipboardCheck,
  FileCheck,
  FileCheck2,
  FileSignature,
  FileText,
  FlaskConical,
  Gauge,
  Landmark,
  ListChecks,
  Rocket,
  Scale,
  ScrollText,
  ShieldCheck,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const templateIcons: Record<string, LucideIcon> = {
  challenge: Target,
  brief: ScrollText,
  screening: ListChecks,
  evaluation: ClipboardCheck,
  eligibility: BadgeCheck,
  declaration: FileSignature,
  pilot: FlaskConical,
  kpi: Gauge,
  risk: TriangleAlert,
  legal: Scale,
  security: ShieldCheck,
  validation: FileCheck2,
  procurement: FileCheck,
  scale: TrendingUp,
  readiness: Rocket,
  landmark: Landmark,
  "file-text": FileText,
};

export const templateIconOptions: { key: string; label: string }[] = [
  { key: "challenge", label: "Challenge" },
  { key: "brief", label: "Brief" },
  { key: "screening", label: "Screening" },
  { key: "evaluation", label: "Evaluation" },
  { key: "eligibility", label: "Eligibility" },
  { key: "declaration", label: "Declaration" },
  { key: "pilot", label: "Pilot" },
  { key: "kpi", label: "KPI" },
  { key: "risk", label: "Risk" },
  { key: "legal", label: "Legal" },
  { key: "security", label: "Security" },
  { key: "validation", label: "Validation" },
  { key: "procurement", label: "Procurement" },
  { key: "scale", label: "Scale-up" },
  { key: "readiness", label: "Readiness" },
  { key: "file-text", label: "Document" },
];

export function getTemplateIcon(icon: string | undefined | null): LucideIcon {
  return templateIcons[(icon ?? "").toLowerCase()] ?? FileText;
}