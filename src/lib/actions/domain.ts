"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, getNextId, nowIso, Doc } from "../db";
import { requireUser, requireRole } from "../auth";
import { createSession } from "../session";
import { normalizeEmail, normalizeUrl } from "../validate";

function int(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function createChallenge(formData: FormData) {
  const user = await requireRole(["government"]);
  const db = await getDb();
  await db.collection<Doc>("challenges").insertOne({
    _id: await getNextId("challenges"),
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    outcome_statement: String(formData.get("outcome_statement") || ""),
    department: String(formData.get("department") || user.department),
    sector: String(formData.get("sector") || ""),
    budget_min: int(formData.get("budget_min")),
    budget_max: int(formData.get("budget_max")),
    status: "draft",
    timeline: String(formData.get("timeline") || ""),
    status_last_updated: nowIso(),
    created_by: user.id,
    created_at: nowIso(),
  });
  revalidatePath("/gov");
  redirect("/gov");
}

export async function publishChallenge(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  await db.collection<Doc>("challenges")
    .updateOne({ _id: id }, { $set: { status: "open", status_last_updated: nowIso() } });
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function deleteChallenge(formData: FormData) {
  await requireRole(["government", "admin"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  // Manual cascade (parity with the previous SQL foreign keys).
  const apps = await db.collection<Doc>("applications").find({ challenge_id: id }).project({ _id: 1 }).toArray();
  const appIds = apps.map((a) => a._id);
  if (appIds.length > 0) {
    await db.collection<Doc>("evaluations").deleteMany({ application_id: { $in: appIds } });
    await db.collection<Doc>("applications").deleteMany({ _id: { $in: appIds } });
  }
  const pilots = await db.collection<Doc>("pilots").find({ challenge_id: id }).project({ _id: 1 }).toArray();
  const pilotIds = pilots.map((p) => p._id);
  if (pilotIds.length > 0) {
    await db.collection<Doc>("milestones").deleteMany({ pilot_id: { $in: pilotIds } });
    await db.collection<Doc>("scale_up_decisions").deleteMany({ pilot_id: { $in: pilotIds } });
    await db.collection<Doc>("pilots").deleteMany({ _id: { $in: pilotIds } });
  }
  await db.collection<Doc>("challenges").deleteOne({ _id: id });
  revalidatePath("/gov");
  revalidatePath("/admin");
}

export async function upsertStartupProfile(formData: FormData) {
  const user = await requireRole(["startup"]);
  const db = await getDb();
  await db.collection<Doc>("startup_profiles").updateOne(
    { user_id: user.id },
    {
      $set: {
        company_name: String(formData.get("company_name") || ""),
        cin: String(formData.get("cin") || ""),
        dipit_number: String(formData.get("dipit_number") || ""),
        incorporated_year: int(formData.get("incorporated_year")),
        sector: String(formData.get("sector") || ""),
        stage: String(formData.get("stage") || ""),
        funding_raised: int(formData.get("funding_raised")),
        employee_count: int(formData.get("employee_count")),
        website: String(formData.get("website") || ""),
        pitch: String(formData.get("pitch") || ""),
        locations: String(formData.get("locations") || ""),
      },
    },
    { upsert: true }
  );
  revalidatePath("/startup");
  redirect("/startup/profile");
}

export async function applyToChallenge(formData: FormData) {
  const user = await requireRole(["startup"]);
  const db = await getDb();
  const challengeId = int(formData.get("challenge_id"));
  await db.collection<Doc>("applications").insertOne({
    _id: await getNextId("applications"),
    challenge_id: challengeId,
    startup_user_id: user.id,
    solution_summary: String(formData.get("solution_summary") || ""),
    tech_readiness: String(formData.get("tech_readiness") || ""),
    differentiator: String(formData.get("differentiator") || ""),
    ask_amount: int(formData.get("ask_amount")),
    status: "submitted",
    submitted_at: nowIso(),
    updated_at: nowIso(),
  });
  revalidatePath("/startup");
  revalidatePath("/gov");
  redirect(`/startup/challenges/${challengeId}`);
}

export async function updateApplicationStatus(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  const status = String(formData.get("status") || "");
  await db.collection<Doc>("applications").updateOne({ _id: id }, { $set: { status, updated_at: nowIso() } });
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function submitEvaluation(formData: FormData) {
  await requireRole(["evaluator"]);
  const db = await getDb();
  const appId = int(formData.get("application_id"));
  const evaluatorId = (await requireUser()).id;
  await db.collection<Doc>("evaluations").insertOne({
    _id: await getNextId("evaluations"),
    application_id: appId,
    evaluator_user_id: evaluatorId,
    innovation_score: int(formData.get("innovation_score")),
    feasibility_score: int(formData.get("feasibility_score")),
    impact_score: int(formData.get("impact_score")),
    scalability_score: int(formData.get("scalability_score")),
    viability_score: int(formData.get("viability_score")),
    comments: String(formData.get("comments") || ""),
    recommendation: String(formData.get("recommendation") || ""),
    submitted_at: nowIso(),
  });
  revalidatePath("/evaluator");
  redirect("/evaluator");
}

export async function createPilot(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const challengeId = int(formData.get("challenge_id"));
  const pilotId = await getNextId("pilots");
  await db.collection<Doc>("pilots").insertOne({
    _id: pilotId,
    challenge_id: challengeId,
    startup_user_id: int(formData.get("startup_user_id")),
    application_id: int(formData.get("application_id")),
    title: String(formData.get("title") || ""),
    budget: int(formData.get("budget")),
    start_date: String(formData.get("start_date") || ""),
    end_date: String(formData.get("end_date") || ""),
    status: "design",
    ip_clause: String(formData.get("ip_clause") || ""),
    data_clause: String(formData.get("data_clause") || ""),
    cybersecurity_clause: String(formData.get("cybersecurity_clause") || ""),
    risk_clause: String(formData.get("risk_clause") || ""),
    created_at: nowIso(),
  });
  await db.collection<Doc>("challenges")
    .updateOne({ _id: challengeId }, { $set: { status: "piloting", status_last_updated: nowIso() } });
  revalidatePath("/gov");
  redirect(`/gov/pilots/${pilotId}`);
}

export async function updatePilotStatus(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  const status = String(formData.get("status") || "");
  await db.collection<Doc>("pilots").updateOne({ _id: id }, { $set: { status } });
  if (status === "active") {
    const pilot = await db.collection<Doc>("pilots").findOne({ _id: id });
    if (pilot) {
      await db.collection<Doc>("challenges")
        .updateOne({ _id: pilot.challenge_id }, { $set: { status: "piloting", status_last_updated: nowIso() } });
    }
  }
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function addMilestone(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const pilotId = int(formData.get("pilot_id"));
  await db.collection<Doc>("milestones").insertOne({
    _id: await getNextId("milestones"),
    pilot_id: pilotId,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    due_date: String(formData.get("due_date") || ""),
    amount: int(formData.get("amount")),
    status: "pending",
    verified_by: null,
    verified_at: null,
    paid_at: null,
    payment_ref: "",
  });
  revalidatePath("/gov");
  revalidatePath("/startup");
  redirect(`/gov/pilots/${pilotId}`);
}

export async function updateMilestone(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  const action = String(formData.get("action") || "");
  const user = await requireUser();
  if (action === "verify") {
    await db.collection<Doc>("milestones")
      .updateOne({ _id: id }, { $set: { status: "verified", verified_by: user.id, verified_at: nowIso() } });
  } else if (action === "pay") {
    await db.collection<Doc>("milestones")
      .updateOne(
        { _id: id },
        { $set: { status: "paid", paid_at: nowIso(), payment_ref: String(formData.get("payment_ref") || `PFMS-${Date.now()}`) } }
      );
  }
  revalidatePath("/gov");
  revalidatePath("/startup");
}

export async function submitScaleDecision(formData: FormData) {
  await requireRole(["government"]);
  const db = await getDb();
  const pilotId = int(formData.get("pilot_id"));
  const user = await requireUser();
  const decision = String(formData.get("decision") || "");
  await db.collection<Doc>("scale_up_decisions").insertOne({
    _id: await getNextId("scale_up_decisions"),
    pilot_id: pilotId,
    decision,
    districts: String(formData.get("districts") || ""),
    procurement_pathway: String(formData.get("procurement_pathway") || ""),
    validation_notes: String(formData.get("validation_notes") || ""),
    decision_by: user.id,
    decision_at: nowIso(),
  });
  const pilot = await db.collection<Doc>("pilots").findOne({ _id: pilotId });
  if (pilot) {
    const status = decision === "scale" ? "scaling" : "completed";
    await db.collection<Doc>("challenges")
      .updateOne({ _id: pilot.challenge_id }, { $set: { status, status_last_updated: nowIso() } });
  }
  revalidatePath("/gov");
  revalidatePath("/startup");
  redirect(`/gov/pilots/${pilotId}`);
}

export async function createUser(formData: FormData) {
  await requireRole(["admin"]);
  const db = await getDb();
  const { default: bcrypt } = await import("bcryptjs");
  const name = String(formData.get("name") || "").trim();
  const email = normalizeEmail(formData.get("email"));
  const role = String(formData.get("role") || "");
  const org = String(formData.get("org") || "");
  const dept = String(formData.get("department") || "");
  const password = String(formData.get("password") || "demo1234");
  if (!name || !email || !role) return;
  const existing = await db.collection<Doc>("users").findOne({ email });
  if (existing) return;
  const hash = bcrypt.hashSync(password, 10);
  try {
    await db.collection<Doc>("users").insertOne({
      _id: await getNextId("users"),
      name,
      email,
      password_hash: hash,
      role,
      org,
      department: dept,
      designation: "",
      phone: "",
      created_at: nowIso(),
    });
  } catch {
    // Lost a race with another admin creating the same email (unique index).
    return;
  }
  revalidatePath("/admin");
  redirect("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  await requireRole(["admin"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  const role = String(formData.get("role") || "");
  if (!role) return;
  await db.collection<Doc>("users").updateOne({ _id: id }, { $set: { role } });
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await requireRole(["admin"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  await db.collection<Doc>("startup_profiles").deleteOne({ user_id: id });
  await db.collection<Doc>("startup_attachments").deleteMany({ startup_user_id: id });
  await db.collection<Doc>("users").deleteOne({ _id: id });
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function addAttachment(formData: FormData) {
  const user = await requireRole(["startup"]);
  const db = await getDb();
  const label = String(formData.get("label") || "").trim().slice(0, 120);
  const url = normalizeUrl(formData.get("url"));
  if (!label || !url) return;
  await db.collection<Doc>("startup_attachments").insertOne({
    _id: await getNextId("startup_attachments"),
    startup_user_id: user.id,
    label,
    url,
    created_at: nowIso(),
  });
  revalidatePath("/startup/profile");
}

export async function deleteAttachment(formData: FormData) {
  const user = await requireRole(["startup"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  await db.collection<Doc>("startup_attachments").deleteOne({ _id: id, startup_user_id: user.id });
  revalidatePath("/startup/profile");
}

export async function updateAccount(formData: FormData) {
  const user = await requireUser();
  const db = await getDb();
  const name = String(formData.get("name") || "").trim().slice(0, 120);
  const email = normalizeEmail(formData.get("email"));
  if (!name || !email) redirect("/account?error=missing");
  const taken = await db.collection<Doc>("users").findOne({ email, _id: { $ne: user.id } });
  if (taken) redirect("/account?error=email-taken");
  await db.collection<Doc>("users").updateOne({ _id: user.id }, { $set: { name, email } });
  await createSession(user.id, user.role, name);
  revalidatePath("/account");
  redirect("/account?saved=profile");
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const db = await getDb();
  const current = String(formData.get("current_password") || "");
  const next = String(formData.get("new_password") || "");
  const confirm = String(formData.get("confirm_password") || "");
  if (next !== confirm) redirect("/account?error=password-mismatch");
  if (next.length < 8) redirect("/account?error=password-short");
  const { default: bcrypt } = await import("bcryptjs");
  const row = (await db.collection<Doc>("users").findOne({ _id: user.id })) as any;
  const ok = row ? bcrypt.compareSync(current, row.password_hash) : false;
  if (!ok) redirect("/account?error=current-password");
  await db.collection<Doc>("users").updateOne({ _id: user.id }, { $set: { password_hash: bcrypt.hashSync(next, 10) } });
  revalidatePath("/account");
  redirect("/account?saved=password");
}
