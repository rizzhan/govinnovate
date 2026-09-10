import { MongoClient, type Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getNextId, resetDbCache, setTestDb, type Doc } from "./db";
import { runMigrations } from "./migrate";
import {
  getAllUsers,
  getApplication,
  getApplications,
  getAttachments,
  getChallenge,
  getChallenges,
  getEvaluationsForApplication,
  getMilestones,
  getPilot,
  getPilots,
  getScaleUpDecision,
  getStartupProfile,
  getStats,
  getTemplate,
  getTemplates,
} from "./data";

let mongod: MongoMemoryServer;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db("govinnovate-test");
  await runMigrations(db);
  // Migrations twice: must be a safe no-op the second time.
  await runMigrations(db);
  setTestDb(db);

  await db.collection<Doc>("users").insertMany([
    { _id: 1, name: "Dept Officer", email: "gov@test.in", password_hash: "x", role: "government", org: "Test Dept", department: "Test", designation: "", phone: "", created_at: "2026-01-01T00:00:00.000Z" },
    { _id: 2, name: "Founder", email: "startup@test.in", password_hash: "x", role: "startup", org: "TestCo", department: "", designation: "", phone: "", created_at: "2026-01-01T00:00:00.000Z" },
    { _id: 3, name: "Professor", email: "eval@test.in", password_hash: "x", role: "evaluator", org: "Test Univ", department: "", designation: "", phone: "", created_at: "2026-01-01T00:00:00.000Z" },
  ]);
  await db.collection<Doc>("challenges").insertMany([
    { _id: 1, title: "Water", description: "", outcome_statement: "", department: "D1", sector: "S", budget_min: 1, budget_max: 2, status: "open", timeline: "", created_by: 1, created_at: "2026-01-01T00:00:00.000Z" },
    { _id: 2, title: "Health", description: "", outcome_statement: "", department: "D2", sector: "S", budget_min: 1, budget_max: 2, status: "draft", timeline: "", created_by: 1, created_at: "2026-01-01T00:00:00.000Z" },
  ]);
  await db.collection<Doc>("applications").insertMany([
    { _id: 1, challenge_id: 1, startup_user_id: 2, solution_summary: "s", tech_readiness: "t", differentiator: "d", ask_amount: 100, status: "submitted", submitted_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" },
  ]);
  await db.collection<Doc>("evaluations").insertMany([
    { _id: 1, application_id: 1, evaluator_user_id: 3, innovation_score: 8, feasibility_score: 8, impact_score: 8, scalability_score: 8, viability_score: 8, comments: "good", recommendation: "shortlist", submitted_at: "2026-01-01T00:00:00.000Z" },
  ]);
  await db.collection<Doc>("pilots").insertMany([
    { _id: 1, challenge_id: 1, startup_user_id: 2, application_id: 1, title: "P1", budget: 1000, start_date: "", end_date: "", status: "active", ip_clause: "", data_clause: "", cybersecurity_clause: "", risk_clause: "", created_at: "2026-01-01T00:00:00.000Z" },
  ]);
  await db.collection<Doc>("milestones").insertMany([
    { _id: 1, pilot_id: 1, title: "M1", description: "", due_date: "", amount: 600, status: "paid", verified_by: 1, verified_at: "", paid_at: "", payment_ref: "R1" },
    { _id: 2, pilot_id: 1, title: "M2", description: "", due_date: "", amount: 400, status: "pending", verified_by: null, verified_at: null, paid_at: null, payment_ref: "" },
  ]);
  await db.collection<Doc>("scale_up_decisions").insertMany([
    { _id: 1, pilot_id: 1, decision: "in_progress", districts: "", procurement_pathway: "", validation_notes: "", decision_by: 1, decision_at: "2026-01-01T00:00:00.000Z" },
    { _id: 2, pilot_id: 1, decision: "scale", districts: "D", procurement_pathway: "GeM", validation_notes: "ok", decision_by: 1, decision_at: "2026-01-02T00:00:00.000Z" },
  ]);
  await db.collection<Doc>("templates").insertMany([
    { _id: 1, title: "T1", category: "Pilot", description: "", content: "", icon: "pilot", created_at: "" },
    { _id: 2, title: "T2", category: "Challenge", description: "", content: "", icon: "challenge", created_at: "" },
  ]);
  await db.collection<Doc>("startup_profiles").insertOne({ _id: 2, user_id: 2, company_name: "TestCo", cin: "", dipit_number: "", incorporated_year: 2022, sector: "", stage: "", funding_raised: 0, employee_count: 1, website: "", pitch: "", locations: "" });
  await db.collection<Doc>("startup_attachments").insertOne({ _id: 1, startup_user_id: 2, label: "Deck", url: "https://x.test", created_at: "" });
  await db.collection<Doc>("counters").updateMany({}, { $set: { seq: 100 } });
}, 180000);

afterAll(async () => {
  resetDbCache();
  await mongod.stop();
});

describe("challenges", () => {
  it("lists newest first and filters", async () => {
    expect((await getChallenges()).map((c) => c.id)).toEqual([2, 1]);
    expect((await getChallenges({ status: "open" })).map((c) => c.id)).toEqual([1]);
    expect((await getChallenges({ by: 1 })).length).toBe(2);
    expect((await getChallenge(1))?.title).toBe("Water");
    expect(await getChallenge(999)).toBeUndefined();
  });
});

describe("applications + evaluations join", () => {
  it("attaches challenge and startup names", async () => {
    const apps = await getApplications({ challengeId: 1 });
    expect(apps.length).toBe(1);
    expect(apps[0].challenge_title).toBe("Water");
    expect(apps[0].startup_name).toBe("Founder");
    expect(apps[0].department).toBe("D1");
    const one = await getApplication(1);
    expect(one?.startup_email).toBe("startup@test.in");
    expect(one?.startup_org).toBe("TestCo");
    expect(await getApplication(999)).toBeUndefined();
  });

  it("attaches evaluator identity", async () => {
    const evals = await getEvaluationsForApplication(1);
    expect(evals.length).toBe(1);
    expect(evals[0].evaluator_name).toBe("Professor");
    expect(evals[0].evaluator_org).toBe("Test Univ");
    expect(await getEvaluationsForApplication(999)).toEqual([]);
  });
});

describe("pilots, milestones, scale decisions", () => {
  it("joins names and orders milestones", async () => {
    const pilots = await getPilots();
    expect(pilots[0].startup_name).toBe("Founder");
    expect(pilots[0].challenge_title).toBe("Water");
    const ms = await getMilestones(1);
    expect(ms.map((m) => m.id)).toEqual([1, 2]);
    expect((await getPilot(1))?.startup_email).toBe("startup@test.in");
  });

  it("returns the latest scale decision", async () => {
    expect((await getScaleUpDecision(1))?.decision).toBe("scale");
    expect(await getScaleUpDecision(999)).toBeUndefined();
  });
});

describe("templates, users, profiles, stats", () => {
  it("orders templates by category then id", async () => {
    expect((await getTemplates()).map((t) => t.id)).toEqual([2, 1]);
    expect((await getTemplate(1))?.title).toBe("T1");
  });

  it("lists users and profiles", async () => {
    expect((await getAllUsers()).length).toBe(3);
    expect((await getStartupProfile(2))?.company_name).toBe("TestCo");
    expect(await getStartupProfile(1)).toBeUndefined();
    expect((await getAttachments(2)).map((a) => a.label)).toEqual(["Deck"]);
  });

  it("counts platform stats", async () => {
    expect(await getStats()).toEqual({ challenges: 2, applications: 1, pilots: 1, startups: 1, templates: 2 });
  });
});

describe("numeric id counters", () => {
  it("hands out increasing ids per collection", async () => {
    const a = await getNextId("e2e-counter-check");
    const b = await getNextId("e2e-counter-check");
    expect(b).toBe(a + 1);
  });
});
