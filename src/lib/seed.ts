import { db, migrate } from "./db";
import bcrypt from "bcryptjs";

const PASSWORD = "demo1234";

function seedUsers() {
  const hash = bcrypt.hashSync(PASSWORD, 10);
  const upsert = db.prepare(
    `INSERT INTO users (name, email, password_hash, role, org, department, designation, phone)
     VALUES (@name, @email, @password_hash, @role, @org, @department, @designation, @phone)
     ON CONFLICT(email) DO NOTHING`
  );

  const users: any[] = [
    {
      name: "System Administrator",
      email: "admin@govinnovate.in",
      role: "admin",
      org: "GovInnovate Platform",
      department: "Platform Administration",
      designation: "Platform Admin",
      phone: "9000000000",
    },
    {
      name: "Meera Iyer",
      email: "gov@example.gov.in",
      role: "government",
      org: "Ministry of Urban Development",
      department: "Smart Cities Mission",
      designation: "Joint Secretary",
      phone: "9000000001",
    },
    {
      name: "Rohan Desai",
      email: "startup@example.com",
      role: "startup",
      org: "AquaSense Technologies Pvt Ltd",
      department: "",
      designation: "CEO & Co-founder",
      phone: "9000000002",
    },
    {
      name: "Dr. Anil Sharma",
      email: "evaluator@example.com",
      role: "evaluator",
      org: "IIT Delhi",
      department: "Centre for Innovation",
      designation: "Professor",
      phone: "9000000003",
    },
    {
      name: "Priya Nair",
      email: "gov2@example.gov.in",
      role: "government",
      org: "Ministry of Health",
      department: "National Health Mission",
      designation: "Director",
      phone: "9000000004",
    },
    {
      name: "Karan Mehta",
      email: "startup2@example.com",
      role: "startup",
      org: "MediRemote Health India Pvt Ltd",
      department: "",
      designation: "Founder",
      phone: "9000000005",
    },
  ];

  for (const u of users) {
    upsert.run({ ...u, password_hash: hash });
  }
}

function seedChallenges() {
  const insert = db.prepare(
    `INSERT INTO challenges
      (title, description, outcome_statement, department, sector, budget_min, budget_max, status, timeline, created_by)
     VALUES (@title, @description, @outcome_statement, @department, @sector, @budget_min, @budget_max, @status, @timeline, @created_by)`
  );

  const rows: any[] = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
  ];

  for (const r of rows) insert.run(r);
}

function seedProfiles() {
  const insert = db.prepare(
    `INSERT INTO startup_profiles
      (user_id, company_name, cin, dipit_number, incorporated_year, sector, stage, funding_raised, employee_count, website, pitch, locations)
     VALUES (@user_id, @company_name, @cin, @dipit_number, @incorporated_year, @sector, @stage, @funding_raised, @employee_count, @website, @pitch, @locations)
     ON CONFLICT(user_id) DO NOTHING`
  );
  insert.run({
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
  });
  insert.run({
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
  });
}

function seedApplications() {
  const insert = db.prepare(
    `INSERT INTO applications
      (challenge_id, startup_user_id, solution_summary, tech_readiness, differentiator, ask_amount, status)
     VALUES (@challenge_id, @startup_user_id, @solution_summary, @tech_readiness, @differentiator, @ask_amount, @status)`
  );
  // Challenge 1 (piloting) -> startup 3 applied & selected
  insert.run({
    challenge_id: 1,
    startup_user_id: 3,
    solution_summary:
      "Deployment of 20 solar-powered IoT water-quality sensors across 5 lakes with a cloud dashboard, SMS/email alerts and a mobile app for field teams.",
    tech_readiness: "TRL 7 - System prototype demonstrated in operational environment",
    differentiator:
      "Solar-powered, zero-maintenance sensors at 40% lower cost than imports with edge analytics reducing data transmission needs.",
    ask_amount: 5000000,
    status: "shortlisted",
  });
  // Challenge 2 (evaluate) -> startup 6 applied, startup 3 applied
  insert.run({
    challenge_id: 2,
    startup_user_id: 6,
    solution_summary:
      "Offline-first AI triage mobile app for PHC field workers with 40-clinical-protocol coverage and 12-language support.",
    tech_readiness: "TRL 6 - Technology demonstrated in relevant environment",
    differentiator:
      "Runs fully offline on $40 Android devices; local-language voice input for semi-literate users.",
    ask_amount: 8000000,
    status: "submitted",
  });
  insert.run({
    challenge_id: 2,
    startup_user_id: 3,
    solution_summary:
      "Adaptation of water-monitoring platform with a lightweight triage module - not a primary fit.",
    tech_readiness: "TRL 5 - Technology validated in relevant environment",
    differentiator: "Cross-domain IoT expertise, existing state partnerships.",
    ask_amount: 9000000,
    status: "submitted",
  });
  // Challenge 3 (open) -> startup 3 & 6 applied, one rejected
  insert.run({
    challenge_id: 3,
    startup_user_id: 3,
    solution_summary:
      "Bin-fill ultrasonic sensors + dynamic route optimisation engine with live control-room dashboard.",
    tech_readiness: "TRL 6",
    differentiator: "Self-calibrating sensors and ML-optimised routing.",
    ask_amount: 6500000,
    status: "submitted",
  });
  insert.run({
    challenge_id: 3,
    startup_user_id: 6,
    solution_summary: "Basic static route planning with manual bin surveys - limited live sensing.",
    tech_readiness: "TRL 4",
    differentiator: "Low cost but no real-time sensing capability.",
    ask_amount: 3000000,
    status: "rejected",
  });
}

function seedEvaluations() {
  const insert = db.prepare(
    `INSERT INTO evaluations
      (application_id, evaluator_user_id, innovation_score, feasibility_score, impact_score, scalability_score, viability_score, comments, recommendation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  // Application 1 (AquaSense for challenge 1) evaluated by Dr. Anil (4)
  insert.run(
    1,
    4,
    8.5,
    8.0,
    9.0,
    8.5,
    7.5,
    "Technically strong, proven in operational environment. Clear cost advantage. Cash-flow and payment milestones must be well structured.",
    "shortlist"
  );
}

function seedPilots() {
  const insert = db.prepare(
    `INSERT INTO pilots
      (challenge_id, startup_user_id, application_id, title, budget, start_date, end_date, status,
       ip_clause, data_clause, cybersecurity_clause, risk_clause)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  insert.run(
    1,
    3,
    1,
    "Water Quality Monitoring Pilot - 5 Urban Lakes",
    5000000,
    "2026-03-01",
    "2026-08-31",
    "scaling",
    "Background IP remains with the startup; foreground IP generated during pilot is jointly owned with the department.",
    "Data generated is shared with department for public-good analytics; personal data not collected. Anonymised open data published monthly.",
    "Sensors communicate over encrypted channels; OWASP-aligned review of dashboard; periodic third-party pen-test required.",
    "Pilot limited to 5 lakes; on predefined performance metrics, the department may extend or close early; risk shared via milestone-linked payments."
  );

  // Also a pilot in "design" stage for challenge 2? Keep it as evaluate stage challenge. We'll leave one pilot.
}

function seedMilestones() {
  const insert = db.prepare(
    `INSERT INTO milestones (pilot_id, title, description, due_date, amount, status, verified_by, verified_at, paid_at, payment_ref)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  // Pilot 1, 4 milestones
  insert.run(
    1,
    "M1 - Deployment & commissioning",
    "Install 20 sensors across 5 lakes, commission dashboard, staff training.",
    "2026-04-05",
    1500000,
    "paid",
    2,
    "2026-04-10",
    "2026-04-12",
    "PFMS-2026-8841"
  );
  insert.run(
    1,
    "M2 - Live monitoring & baseline",
    "30 days continuous live monitoring, baseline pollution map submitted.",
    "2026-05-10",
    1500000,
    "paid",
    2,
    "2026-05-15",
    "2026-05-18",
    "PFMS-2026-9912"
  );
  insert.run(
    1,
    "M3 - Alerting & remediation integration",
    "Alerts triggered within 15 min of threshold breach; integrated with civic AMC workflow.",
    "2026-06-30",
    1200000,
    "verified",
    2,
    "2026-07-02",
    null,
    ""
  );
  insert.run(
    1,
    "M4 - Final validation & scale recommendation",
    "Independent third-party validation of targets; final report and scale-up recommendation.",
    "2026-08-31",
    800000,
    "pending",
    null,
    null,
    null,
    ""
  );
}

function seedScaleUp() {
  const insert = db.prepare(
    `INSERT INTO scale_up_decisions (pilot_id, decision, districts, procurement_pathway, validation_notes, decision_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  insert.run(
    1,
    "in_progress",
    "Pune, Nashik, Aurangabad",
    "GeM (Government e-Marketplace) rate contract under Innovation Procurement category",
    "Independent validation confirmed 96% sensor uptime and <12 min alert time. Recommendation to scale pending final milestone.",
    2
  );
}

function seedTemplates() {
  const insert = db.prepare(
    `INSERT INTO templates (title, category, description, content, icon)
     VALUES (?, ?, ?, ?, ?)`
  );
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
  for (const row of t) insert.run(...row);
}

export function seedAll() {
  migrate();
  db.exec(`
    DELETE FROM scale_up_decisions;
    DELETE FROM milestones;
    DELETE FROM pilots;
    DELETE FROM evaluations;
    DELETE FROM applications;
    DELETE FROM startup_profiles;
    DELETE FROM challenges;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('users','challenges','applications','pilots','milestones','scale_up_decisions');
  `);
  seedUsers();
  seedProfiles();
  seedChallenges();
  seedApplications();
  seedEvaluations();
  seedPilots();
  seedMilestones();
  seedScaleUp();
  seedTemplates();
  console.log("Database seeded successfully.");
}
