import bcrypt from "bcryptjs";
import type { Db } from "mongodb";
import { getDb, nowIso, Doc } from "./db";

const PASSWORD = "demo1234";

async function seedUsers(db: Db) {
  const hash = bcrypt.hashSync(PASSWORD, 10);
  const now = nowIso();
  await db.collection<Doc>("users").insertMany([
    { _id: 1, name: "System Administrator", email: "admin@govinnovate.in", password_hash: hash, role: "admin", org: "GovInnovate Platform", department: "Platform Administration", designation: "Platform Admin", phone: "9000000000", created_at: now },
    { _id: 2, name: "Meera Iyer", email: "gov@example.gov.in", password_hash: hash, role: "government", org: "Ministry of Urban Development", department: "Smart Cities Mission", designation: "Joint Secretary", phone: "9000000001", created_at: now },
    { _id: 3, name: "Rohan Desai", email: "startup@example.com", password_hash: hash, role: "startup", org: "AquaSense Technologies Pvt Ltd", department: "", designation: "CEO & Co-founder", phone: "9000000002", created_at: now },
    { _id: 4, name: "Dr. Anil Sharma", email: "evaluator@example.com", password_hash: hash, role: "evaluator", org: "IIT Delhi", department: "Centre for Innovation", designation: "Professor", phone: "9000000003", created_at: now },
    { _id: 5, name: "Priya Nair", email: "gov2@example.gov.in", password_hash: hash, role: "government", org: "Ministry of Health", department: "National Health Mission", designation: "Director", phone: "9000000004", created_at: now },
    { _id: 6, name: "Karan Mehta", email: "startup2@example.com", password_hash: hash, role: "startup", org: "MediRemote Health India Pvt Ltd", department: "", designation: "Founder", phone: "9000000005", created_at: now },
  ]);
}

async function seedProfiles(db: Db) {
  await db.collection<Doc>("startup_profiles").insertMany([
    {
      _id: 3,
      user_id: 3,
      company_name: "AquaSense Technologies Pvt Ltd",
      cin: "U74999MH2021PTC123456",
      dipit_number: "DIPP12345",
      incorporated_year: 2021,
      sector: "Environment & Water",
      stage: "Series A",
      funding_raised: 45000000,
      employee_count: 42,
      website: "https://aquasense.example.com",
      pitch:
        "Low-cost solar-powered IoT sensors with edge-based analytics for real-time water quality monitoring in lakes, rivers and treatment plants. Deployed across 3 states.",
      locations: "Mumbai, Pune, Bengaluru",
    },
    {
      _id: 6,
      user_id: 6,
      company_name: "MediRemote Health India Pvt Ltd",
      cin: "U85110DL2020PTC654321",
      dipit_number: "DIPP98765",
      incorporated_year: 2020,
      sector: "Healthcare",
      stage: "Seed",
      funding_raised: 12000000,
      employee_count: 18,
      website: "https://mediremote.example.com",
      pitch:
        "Offline-first AI triage assistant for front-line health workers that works on low-cost Android devices with local-language support.",
      locations: "Delhi, Lucknow",
    },
  ]);
}

async function seedAttachments(db: Db) {
  await db.collection<Doc>("startup_attachments").insertMany([
    { _id: 1, startup_user_id: 3, label: "Pilot deployment report — 5 urban lakes", url: "https://aquasense.example.com/reports/lake-pilot", created_at: nowIso() },
    { _id: 2, startup_user_id: 3, label: "DPIIT recognition certificate", url: "https://aquasense.example.com/compliance/dpiit", created_at: nowIso() },
  ]);
}

async function seedChallenges(db: Db) {
  const now = nowIso();
  await db.collection<Doc>("challenges").insertMany([
    {
      _id: 1,
      title: "Intelligent Water Quality Monitoring for Urban Lakes",
      description:
        "Urban lakes across Smart Cities are facing degradation due to untreated discharge and unmonitored pollution. The department needs a low-cost, IoT-enabled monitoring solution that provides real-time water quality data and early-warning alerts to prevent further degradation.",
      outcome_statement:
        "Deploy a pilot covering at least 5 lakes with 95% sensor uptime and alert generation within 15 minutes of threshold breach, enabling accelerated remediation response in under 2 hours.",
      department: "Smart Cities Mission",
      sector: "Environment & Water",
      budget_min: 2500000,
      budget_max: 7500000,
      status: "piloting",
      timeline: "6-month pilot with 4 milestone-based payments",
      created_by: 2,
      created_at: now,
    },
    {
      _id: 2,
      title: "AI-Assisted Triage for Rural Primary Health Centres",
      description:
        "Primary Health Centres in rural areas face high patient load with limited doctors. An AI-assisted triage tool could help prioritise cases, reduce referral delays and improve wait-times for critical conditions. The solution must work offline and in low-bandwidth environments.",
      outcome_statement:
        "Reduce average triage time by 50% and critical-case referral delay by 30% across 10 pilot PHCs, with 90% clinician adoption in the pilot period.",
      department: "National Health Mission",
      sector: "Healthcare",
      budget_min: 5000000,
      budget_max: 15000000,
      status: "evaluate",
      timeline: "9-month pilot in 10 PHCs",
      created_by: 5,
      created_at: now,
    },
    {
      _id: 3,
      title: "Smart Solid-Waste Route Optimisation for Municipal Corp.",
      description:
        "Municipal solid-waste collection routes are currently static, leading to fuel wastage and missed pickups. The department seeks an IoT + route-optimisation platform that dynamically re-routes collection vehicles based on real-time bin-fill sensors.",
      outcome_statement:
        "Achieve 20% reduction in fuel consumption and 25% fewer missed pickups across the pilot district, with a control-room dashboard for live monitoring.",
      department: "Municipal Administration",
      sector: "Waste Management",
      budget_min: 3000000,
      budget_max: 10000000,
      status: "open",
      timeline: "Open for startup applications for 45 days",
      created_by: 2,
      created_at: now,
    },
    {
      _id: 4,
      title: "Language-inclusive grievance Redressal Chatbot",
      description:
        "Citizen grievance redressal portals are primarily in English and Hindi, excluding lakhs of non-Hindi speakers. The department seeks a multilingual chatbot (mandatory 12+ scheduled languages) that can classify, route and track grievances in local dialects.",
      outcome_statement:
        "Handle 8+ languages in pilot, resolve 40% of grievances end-to-end without human intervention, and maintain >80% user satisfaction across the pilot.",
      department: "Citizen Services",
      sector: "Digital Governance",
      budget_min: 2000000,
      budget_max: 6000000,
      status: "draft",
      timeline: "Draft stage - not yet published",
      created_by: 2,
      created_at: now,
    },
  ]);
}

async function seedApplications(db: Db) {
  const now = nowIso();
  await db.collection<Doc>("applications").insertMany([
    {
      _id: 1,
      challenge_id: 1,
      startup_user_id: 3,
      solution_summary:
        "Deployment of 20 solar-powered IoT water-quality sensors across 5 lakes with a cloud dashboard, SMS/email alerts and a mobile app for field teams.",
      tech_readiness: "TRL 7 - System prototype demonstrated in operational environment",
      differentiator:
        "Solar-powered, zero-maintenance sensors at 40% lower cost than imports with edge analytics reducing data transmission needs.",
      ask_amount: 5000000,
      status: "shortlisted",
      submitted_at: now,
      updated_at: now,
    },
    {
      _id: 2,
      challenge_id: 2,
      startup_user_id: 6,
      solution_summary:
        "Offline-first AI triage mobile app for PHC field workers with 40-clinical-protocol coverage and 12-language support.",
      tech_readiness: "TRL 6 - Technology demonstrated in relevant environment",
      differentiator:
        "Runs fully offline on $40 Android devices; local-language voice input for semi-literate users.",
      ask_amount: 8000000,
      status: "submitted",
      submitted_at: now,
      updated_at: now,
    },
    {
      _id: 3,
      challenge_id: 2,
      startup_user_id: 3,
      solution_summary:
        "Adaptation of water-monitoring platform with a lightweight triage module - not a primary fit.",
      tech_readiness: "TRL 5 - Technology validated in relevant environment",
      differentiator: "Cross-domain IoT expertise, existing state partnerships.",
      ask_amount: 9000000,
      status: "submitted",
      submitted_at: now,
      updated_at: now,
    },
    {
      _id: 4,
      challenge_id: 3,
      startup_user_id: 3,
      solution_summary:
        "Bin-fill ultrasonic sensors + dynamic route optimisation engine with live control-room dashboard.",
      tech_readiness: "TRL 6",
      differentiator: "Self-calibrating sensors and ML-optimised routing.",
      ask_amount: 6500000,
      status: "submitted",
      submitted_at: now,
      updated_at: now,
    },
    {
      _id: 5,
      challenge_id: 3,
      startup_user_id: 6,
      solution_summary: "Basic static route planning with manual bin surveys - limited live sensing.",
      tech_readiness: "TRL 4",
      differentiator: "Low cost but no real-time sensing capability.",
      ask_amount: 3000000,
      status: "rejected",
      submitted_at: now,
      updated_at: now,
    },
  ]);
}

async function seedEvaluations(db: Db) {
  await db.collection<Doc>("evaluations").insertMany([
    {
      _id: 1,
      application_id: 1,
      evaluator_user_id: 4,
      innovation_score: 8.5,
      feasibility_score: 8.0,
      impact_score: 9.0,
      scalability_score: 8.5,
      viability_score: 7.5,
      comments:
        "Technically strong, proven in operational environment. Clear cost advantage. Cash-flow and payment milestones must be well structured.",
      recommendation: "shortlist",
      submitted_at: nowIso(),
    },
  ]);
}

async function seedPilots(db: Db) {
  await db.collection<Doc>("pilots").insertMany([
    {
      _id: 1,
      challenge_id: 1,
      startup_user_id: 3,
      application_id: 1,
      title: "Water Quality Monitoring Pilot - 5 Urban Lakes",
      budget: 5000000,
      start_date: "2026-03-01",
      end_date: "2026-08-31",
      status: "scaling",
      ip_clause:
        "Background IP remains with the startup; foreground IP generated during pilot is jointly owned with the department.",
      data_clause:
        "Data generated is shared with department for public-good analytics; personal data not collected. Anonymised open data published monthly.",
      cybersecurity_clause:
        "Sensors communicate over encrypted channels; OWASP-aligned review of dashboard; periodic third-party pen-test required.",
      risk_clause:
        "Pilot limited to 5 lakes; on predefined performance metrics, the department may extend or close early; risk shared via milestone-linked payments.",
      created_at: nowIso(),
    },
  ]);
}

async function seedMilestones(db: Db) {
  await db.collection<Doc>("milestones").insertMany([
    {
      _id: 1,
      pilot_id: 1,
      title: "M1 - Deployment & commissioning",
      description: "Install 20 sensors across 5 lakes, commission dashboard, staff training.",
      due_date: "2026-04-05",
      amount: 1500000,
      status: "paid",
      verified_by: 2,
      verified_at: "2026-04-10",
      paid_at: "2026-04-12",
      payment_ref: "PFMS-2026-8841",
    },
    {
      _id: 2,
      pilot_id: 1,
      title: "M2 - Live monitoring & baseline",
      description: "30 days continuous live monitoring, baseline pollution map submitted.",
      due_date: "2026-05-10",
      amount: 1500000,
      status: "paid",
      verified_by: 2,
      verified_at: "2026-05-15",
      paid_at: "2026-05-18",
      payment_ref: "PFMS-2026-9912",
    },
    {
      _id: 3,
      pilot_id: 1,
      title: "M3 - Alerting & remediation integration",
      description: "Alerts triggered within 15 min of threshold breach; integrated with civic AMC workflow.",
      due_date: "2026-06-30",
      amount: 1200000,
      status: "verified",
      verified_by: 2,
      verified_at: "2026-07-02",
      paid_at: null,
      payment_ref: "",
    },
    {
      _id: 4,
      pilot_id: 1,
      title: "M4 - Final validation & scale recommendation",
      description: "Independent third-party validation of targets; final report and scale-up recommendation.",
      due_date: "2026-08-31",
      amount: 800000,
      status: "pending",
      verified_by: null,
      verified_at: null,
      paid_at: null,
      payment_ref: "",
    },
  ]);
}

async function seedScaleUp(db: Db) {
  await db.collection<Doc>("scale_up_decisions").insertMany([
    {
      _id: 1,
      pilot_id: 1,
      decision: "in_progress",
      districts: "Pune, Nashik, Aurangabad",
      procurement_pathway: "GeM (Government e-Marketplace) rate contract under Innovation Procurement category",
      validation_notes:
        "Independent validation confirmed 96% sensor uptime and <12 min alert time. Recommendation to scale pending final milestone.",
      decision_by: 2,
      decision_at: nowIso(),
    },
  ]);
}

async function seedTemplates(db: Db) {
  const t: [string, string, string, string, string][] = [
    [
      "Outcome-Based Problem Statement",
      "Challenge",
      "Template for departments to define operational problems in terms of measurable outcomes, requirements, constraints, and expected impact.",
      "1. Context & Background\n2. Problem Statement (who, what, where, why it matters)\n3. Desired Outcome (measurable, time-bound)\n4. Target Beneficiaries\n5. Constraints & Assumptions\n6. Success Metrics (KPIs)\n7. Data & Integration Requirements\n8. Budget Range & Timeline",
      "challenge",
    ],
    [
      "Challenge Brief & Requirements",
      "Challenge",
      "Structured brief covering the problem, target users, functional requirements, constraints, timeline, and expected outcomes.",
      "1. Problem & Context\n2. Target Users & Beneficiaries\n3. Functional Requirements\n4. Non-Functional Requirements (language, offline, scale)\n5. Constraints & Assumptions\n6. Timeline & Pilot Window\n7. Budget Range\n8. Expected Outcomes & Success Criteria",
      "brief",
    ],
    [
      "Expert Evaluation Criteria Scorecard",
      "Evaluation",
      "Weighted scoring framework for transparent comparison of shortlisted startup solutions.",
      "Score each criterion 1-10:\n1. Innovation & Novelty (20%)\n2. Feasibility & Technical Readiness (25%)\n3. Expected Impact (20%)\n4. Scalability (20%)\n5. Cost & Viability (15%)\nAverage across independent evaluators to produce final recommendation.",
      "evaluation",
    ],
    [
      "Startup Eligibility Checklist",
      "Evaluation",
      "Checklist for verifying startup eligibility, required documentation, capabilities, and applicable procurement conditions.",
      "1. Registered as DPIIT-recognised startup (or willing to register)\n2. Product/service aligns with problem statement\n3. No mandatory prior government turnover (waiver for startups)\n4. Technical readiness level declared\n5. Financial & legal standing check\n6. Conflict-of-interest declaration\n7. Sensitivity/security clearance where applicable",
      "eligibility",
    ],
    [
      "Conflict of Interest Declaration",
      "Evaluation",
      "Standard declaration for evaluators and stakeholders participating in the assessment process.",
      "1. Declaration of Interests (financial, advisory, familial)\n2. Prior Engagements with Applicants\n3. Confidentiality Commitment\n4. Recusal Procedure\n5. Verification & Sign-off\n6. Consequences of Non-Disclosure",
      "declaration",
    ],
    [
      "Pilot / Sandbox Agreement",
      "Pilot",
      "Structured framework for defining pilot objectives, scope, milestones, responsibilities, timelines, and success criteria.",
      "1. Parties & Scope\n2. Milestone Schedule (title, due date, amount, exit criteria)\n3. Payment Terms (milestone-triggered, verified by independent validator)\n4. IP Ownership (background/foreground)\n5. Data Handling & Privacy\n6. Cybersecurity & Compliance\n7. Risk & Early-Exit clauses\n8. Performance Measurement & Reporting\n9. Remedies & Dispute Resolution",
      "pilot",
    ],
    [
      "Pilot KPI & Measurement Framework",
      "Pilot",
      "Template for defining measurable pilot KPIs, baselines, targets, measurement methods, and reporting frequency.",
      "1. Objective & Scope of Measurement\n2. KPI Definitions (name, unit, baseline)\n3. Targets & Thresholds\n4. Measurement Method & Data Source\n5. Reporting Frequency & Format\n6. Independent Validation Approach\n7. Review & Course-Correction Triggers",
      "kpi",
    ],
    [
      "Pilot Risk Assessment",
      "Pilot",
      "Framework for identifying operational, technical, security, financial, and implementation risks during a pilot.",
      "1. Operational Risks\n2. Technical & Integration Risks\n3. Security & Data Risks\n4. Financial & Payment Risks\n5. Implementation & Adoption Risks\n6. Likelihood x Impact Scoring\n7. Owners & Review Cadence",
      "risk",
    ],
    [
      "IP & Data Ownership Clauses",
      "Legal & Compliance",
      "Template clauses covering intellectual property, data ownership, data usage, confidentiality, and responsibilities.",
      "Background IP: remains with originator\nForeground IP created in pilot: jointly owned (department + startup), licence back terms agreed\nData: anonymised public-good datasets released; personal data minimised; consent where required\nOpen-source components compliance\nPublication & disclosure permissions",
      "legal",
    ],
    [
      "Cybersecurity & Data Protection Checklist",
      "Legal & Compliance",
      "Checklist for assessing security, privacy, access control, data handling, and other relevant safeguards.",
      "Cybersecurity: encryption in transit/at rest, OWASP review for web apps, identity & access control, third-party pen-test for sensitive pilots\nRisk: identify top risks, assign owners, define escalation, early-exit triggers, data backup & business continuity, insurance where relevant.",
      "security",
    ],
    [
      "Risk Management Framework",
      "Legal & Compliance",
      "Structured framework for documenting risks, mitigation measures, owners, triggers, and escalation paths.",
      "1. Risk Register Format\n2. Mitigation Measures\n3. Risk Owners\n4. Triggers & Early Warnings\n5. Escalation Paths\n6. Review Cadence\n7. Closure & Handover Criteria",
      "risk",
    ],
    [
      "Pilot Completion & Validation Report",
      "Procurement",
      "Standard report for documenting pilot outcomes, evidence, KPI performance, findings, and validation.",
      "1. Pilot Summary & Objectives\n2. KPI Performance vs Targets\n3. Evidence & Data Annexures\n4. Findings & Deviations\n5. Independent Validator Remarks\n6. Recommendation (scale / extend / close)",
      "validation",
    ],
    [
      "Procurement Transition Checklist",
      "Procurement",
      "Checklist for moving a successful pilot toward a compliant procurement pathway.",
      "1. Independent validation complete\n2. Departmental & finance approvals obtained\n3. Procurement pathway selected (GeM / Innovation Procurement / DPSU challenge)\n4. Outcome-based specifications drafted from pilot learnings\n5. Pricing benchmarked against pilot costs\n6. Scale tender published\n7. Rollout phases & districts defined",
      "procurement",
    ],
    [
      "Scale-up Recommendation Template",
      "Scale-up",
      "Framework for deciding whether a validated solution should be expanded across departments, locations, or districts.",
      "1. Validated Outcomes Summary\n2. Recommended Scale (departments, districts, volumes)\n3. Procurement Pathway & Contract Terms\n4. Pricing & Commercial Model\n5. Risks & Mitigations at Scale\n6. Decision & Approvals",
      "scale",
    ],
    [
      "Scale-up Readiness Assessment",
      "Scale-up",
      "Assessment of solution performance, operational readiness, security, support capacity, and evidence required for broader adoption.",
      "1. Solution Performance at Pilot Scale\n2. Operational Readiness (support, SLAs, staffing)\n3. Security & Compliance Posture\n4. Support Capacity & Training\n5. Evidence Pack Completeness\n6. Readiness Rating & Conditions",
      "readiness",
    ],
  ];
  await db.collection<Doc>("templates").insertMany(
    t.map(([title, category, description, content, icon], i) => ({
      _id: i + 1,
      title,
      category,
      description,
      content,
      icon,
      created_at: nowIso(),
    }))
  );
}

const COUNTER_SEEDS: Record<string, number> = {
  users: 6,
  startup_profiles: 6,
  challenges: 4,
  applications: 5,
  evaluations: 1,
  pilots: 1,
  milestones: 4,
  scale_up_decisions: 1,
  templates: 15,
  startup_attachments: 2,
};

export async function seedAll() {
  const db = await getDb();
  await Promise.all(
    [
      "scale_up_decisions",
      "milestones",
      "pilots",
      "evaluations",
      "applications",
      "startup_attachments",
      "startup_profiles",
      "challenges",
      "templates",
      "users",
    ].map((c) => db.collection<Doc>(c).deleteMany({}))
  );
  await seedUsers(db);
  await seedProfiles(db);
  await seedAttachments(db);
  await seedChallenges(db);
  await seedApplications(db);
  await seedEvaluations(db);
  await seedPilots(db);
  await seedMilestones(db);
  await seedScaleUp(db);
  await seedTemplates(db);
await Promise.all(
    Object.entries(COUNTER_SEEDS).map(([name, seq]) =>
      db
        .collection<{ _id: string; seq: number }>("counters")
        .updateOne({ _id: name }, { $set: { seq } }, { upsert: true })
    )
  );
  console.log("Database seeded successfully.");
}
