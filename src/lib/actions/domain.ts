"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { requireUser, requireRole } from "../auth";
import { createSession } from "../session";

function int(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function createChallenge(formData: FormData) {
  const user = await requireRole(["government"]);
  db.prepare(
    `INSERT INTO challenges
       (title, description, outcome_statement, department, sector,
        budget_min, budget_max, status, timeline, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`
  ).run(
    String(formData.get("title") || ""),
    String(formData.get("description") || ""),
    String(formData.get("outcome_statement") || ""),
    String(formData.get("department") || user.department),
    String(formData.get("sector") || ""),
    int(formData.get("budget_min")),
    int(formData.get("budget_max")),
    String(formData.get("timeline") || ""),
    user.id
  );
  revalidatePath("/gov");
  redirect("/gov");
}

export async function publishChallenge(formData: FormData) {
  await requireRole(["government"]);
  const id = int(formData.get("id"));
  db.prepare(`UPDATE challenges SET status='open', status_last_updated=datetime('now') WHERE id=?`).run(id);
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function deleteChallenge(formData: FormData) {
  await requireRole(["government", "admin"]);
  const id = int(formData.get("id"));
  db.prepare("DELETE FROM challenges WHERE id=?").run(id);
  revalidatePath("/gov");
  revalidatePath("/admin");
}

export async function upsertStartupProfile(formData: FormData) {
  const user = await requireRole(["startup"]);
  db.prepare(
    `INSERT INTO startup_profiles
       (user_id, company_name, cin, dipit_number, incorporated_year, sector, stage,
        funding_raised, employee_count, website, pitch, locations)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       company_name=excluded.company_name,
       cin=excluded.cin,
       dipit_number=excluded.dipit_number,
       incorporated_year=excluded.incorporated_year,
       sector=excluded.sector,
       stage=excluded.stage,
       funding_raised=excluded.funding_raised,
       employee_count=excluded.employee_count,
       website=excluded.website,
       pitch=excluded.pitch,
       locations=excluded.locations`
  ).run(
    user.id,
    String(formData.get("company_name") || ""),
    String(formData.get("cin") || ""),
    String(formData.get("dipit_number") || ""),
    int(formData.get("incorporated_year")),
    String(formData.get("sector") || ""),
    String(formData.get("stage") || ""),
    int(formData.get("funding_raised")),
    int(formData.get("employee_count")),
    String(formData.get("website") || ""),
    String(formData.get("pitch") || ""),
    String(formData.get("locations") || "")
  );
  revalidatePath("/startup");
  redirect("/startup/profile");
}

export async function applyToChallenge(formData: FormData) {
  const user = await requireRole(["startup"]);
  const challengeId = int(formData.get("challenge_id"));
  db.prepare(
    `INSERT INTO applications
       (challenge_id, startup_user_id, solution_summary, tech_readiness, differentiator, ask_amount, status)
     VALUES (?, ?, ?, ?, ?, ?, 'submitted')`
  ).run(
    challengeId,
    user.id,
    String(formData.get("solution_summary") || ""),
    String(formData.get("tech_readiness") || ""),
    String(formData.get("differentiator") || ""),
    int(formData.get("ask_amount"))
  );
  revalidatePath("/startup");
  revalidatePath("/gov");
  redirect(`/startup/challenges/${challengeId}`);
}

export async function updateApplicationStatus(formData: FormData) {
  await requireRole(["government"]);
  const id = int(formData.get("id"));
  const status = String(formData.get("status") || "");
  db.prepare(`UPDATE applications SET status=?, updated_at=datetime('now') WHERE id=?`).run(status, id);
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function submitEvaluation(formData: FormData) {
  await requireRole(["evaluator"]);
  const appId = int(formData.get("application_id"));
  const evaluatorId = (await requireUser()).id;
  db.prepare(
    `INSERT INTO evaluations
       (application_id, evaluator_user_id, innovation_score, feasibility_score, impact_score,
        scalability_score, viability_score, comments, recommendation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    appId,
    evaluatorId,
    int(formData.get("innovation_score")),
    int(formData.get("feasibility_score")),
    int(formData.get("impact_score")),
    int(formData.get("scalability_score")),
    int(formData.get("viability_score")),
    String(formData.get("comments") || ""),
    String(formData.get("recommendation") || "")
  );
  revalidatePath("/evaluator");
  redirect("/evaluator");
}

export async function createPilot(formData: FormData) {
  await requireRole(["government"]);
  const challengeId = int(formData.get("challenge_id"));
  const startupId = int(formData.get("startup_user_id"));
  const applicationId = int(formData.get("application_id"));
  const pilotId = Number(
    db
      .prepare(
        `INSERT INTO pilots
           (challenge_id, startup_user_id, application_id, title, budget, start_date, end_date, status,
            ip_clause, data_clause, cybersecurity_clause, risk_clause)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'design', ?, ?, ?, ?)`
      )
      .run(
        challengeId,
        startupId,
        applicationId,
        String(formData.get("title") || ""),
        int(formData.get("budget")),
        String(formData.get("start_date") || ""),
        String(formData.get("end_date") || ""),
        String(formData.get("ip_clause") || ""),
        String(formData.get("data_clause") || ""),
        String(formData.get("cybersecurity_clause") || ""),
        String(formData.get("risk_clause") || "")
      ).lastInsertRowid
  );
  db.prepare(`UPDATE challenges SET status='piloting', status_last_updated=datetime('now') WHERE id=?`).run(
    challengeId
  );
  revalidatePath("/gov");
  redirect(`/gov/pilots/${pilotId}`);
}

export async function updatePilotStatus(formData: FormData) {
  await requireRole(["government"]);
  const id = int(formData.get("id"));
  const status = String(formData.get("status") || "");
  db.prepare(`UPDATE pilots SET status=? WHERE id=?`).run(status, id);
  if (status === "active") {
    const pilot = db.prepare("SELECT challenge_id FROM pilots WHERE id=?").get(id) as any;
    if (pilot) {
      db.prepare(`UPDATE challenges SET status='piloting', status_last_updated=datetime('now') WHERE id=?`).run(
        pilot.challenge_id
      );
    }
  }
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function addMilestone(formData: FormData) {
  await requireRole(["government"]);
  const pilotId = int(formData.get("pilot_id"));
  db.prepare(
    `INSERT INTO milestones (pilot_id, title, description, due_date, amount, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`
  ).run(
    pilotId,
    String(formData.get("title") || ""),
    String(formData.get("description") || ""),
    String(formData.get("due_date") || ""),
    int(formData.get("amount"))
  );
  revalidatePath("/gov");
  revalidatePath("/startup");
  redirect(`/gov/pilots/${pilotId}`);
}

export async function updateMilestone(formData: FormData) {
  await requireRole(["government"]);
  const id = int(formData.get("id"));
  const action = String(formData.get("action") || "");
  const user = await requireUser();
  if (action === "verify") {
    db.prepare(
      `UPDATE milestones SET status='verified', verified_by=?, verified_at=datetime('now') WHERE id=?`
    ).run(user.id, id);
  } else if (action === "pay") {
    db.prepare(
      `UPDATE milestones SET status='paid', paid_at=datetime('now'), payment_ref=? WHERE id=?`
    ).run(String(formData.get("payment_ref") || `PFMS-${Date.now()}`), id);
  }
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function submitScaleDecision(formData: FormData) {
  await requireRole(["government"]);
  const pilotId = int(formData.get("pilot_id"));
  const user = await requireUser();
  db.prepare(
    `INSERT INTO scale_up_decisions (pilot_id, decision, districts, procurement_pathway, validation_notes, decision_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    pilotId,
    String(formData.get("decision") || ""),
    String(formData.get("districts") || ""),
    String(formData.get("procurement_pathway") || ""),
    String(formData.get("validation_notes") || ""),
    user.id
  );
  const decision = String(formData.get("decision") || "");
  const pilot = db.prepare("SELECT challenge_id FROM pilots WHERE id=?").get(pilotId) as any;
  if (pilot) {
    const status = decision === "scale" ? "scaling" : "completed";
    db.prepare(`UPDATE challenges SET status=?, status_last_updated=datetime('now') WHERE id=?`).run(
      status,
      pilot.challenge_id
    );
  }
  revalidatePath("/gov");
  revalidatePath("/startup");
  redirect(`/gov/pilots/${pilotId}`);
}


export async function createUser(formData: FormData) {
  await requireRole(["admin"]);
  const { default: bcrypt } = await import("bcryptjs");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "");
  const org = String(formData.get("org") || "");
  const dept = String(formData.get("department") || "");
  const password = String(formData.get("password") || "demo1234");
  if (!name || !email || !role) return;
  const existing = db.prepare("SELECT id FROM users WHERE email=?").get(email);
  if (existing) return;
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT INTO users (name, email, password_hash, role, org, department)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(name, email, hash, role, org, dept);
  revalidatePath("/admin");
  redirect("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  await requireRole(["admin"]);
  const id = int(formData.get("id"));
  const role = String(formData.get("role") || "");
  if (!role) return;
  db.prepare("UPDATE users SET role=? WHERE id=?").run(role, id);
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await requireRole(["admin"]);
  const id = int(formData.get("id"));
  db.prepare("DELETE FROM users WHERE id=?").run(id);
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function addAttachment(formData: FormData) {
  const user = await requireRole(["startup"]);
  const label = String(formData.get("label") || "").trim().slice(0, 120);
  let url = String(formData.get("url") || "").trim().slice(0, 500);
  if (!label || !url) return;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) url = "https://" + url;
  db.prepare(
    "INSERT INTO startup_attachments (startup_user_id, label, url) VALUES (?, ?, ?)"
  ).run(user.id, label, url);
  revalidatePath("/startup/profile");
}

export async function deleteAttachment(formData: FormData) {
  const user = await requireRole(["startup"]);
  const id = int(formData.get("id"));
  db.prepare("DELETE FROM startup_attachments WHERE id=? AND startup_user_id=?").run(id, user.id);
  revalidatePath("/startup/profile");
}

export async function updateAccount(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim().slice(0, 120);
  const email = String(formData.get("email") || "").trim().toLowerCase().slice(0, 160);
  if (!name || !email) redirect("/account?error=missing");
  const taken = db.prepare("SELECT id FROM users WHERE email=? AND id<>?").get(email, user.id);
  if (taken) redirect("/account?error=email-taken");
  db.prepare("UPDATE users SET name=?, email=? WHERE id=?").run(name, email, user.id);
  await createSession(user.id, user.role, name);
  revalidatePath("/account");
  redirect("/account?saved=profile");
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const current = String(formData.get("current_password") || "");
  const next = String(formData.get("new_password") || "");
  const confirm = String(formData.get("confirm_password") || "");
  if (next !== confirm) redirect("/account?error=password-mismatch");
  if (next.length < 8) redirect("/account?error=password-short");
  const { default: bcrypt } = await import("bcryptjs");
  const row = db.prepare("SELECT password_hash FROM users WHERE id=?").get(user.id) as any;
  const ok = row ? bcrypt.compareSync(current, row.password_hash) : false;
  if (!ok) redirect("/account?error=current-password");
  db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(bcrypt.hashSync(next, 10), user.id);
  revalidatePath("/account");
  redirect("/account?saved=password");
}
