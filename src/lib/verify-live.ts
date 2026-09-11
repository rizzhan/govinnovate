import "dotenv/config";
import { MongoClient } from "mongodb";
import type { Doc } from "./db";

/**
 * End-to-end accuracy proof: computes every number the landing page and
 * templates library display, straight from the configured database, then
 * asserts each one is present in the rendered HTML.
 *
 * Usage (app must be running, e.g. `npm run dev` in another terminal):
 *   npm run verify:live
 *
 * Exits non-zero on any mismatch.
 */
const BASE_URL = process.env.APP_URL || "http://localhost:3000";
const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

async function main() {
  const uri = (process.env.MONGODB_URI || "").trim();
  if (!uri) {
    console.error("MONGODB_URI is not set (checked .env).");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  console.log(`database in use: ${db.databaseName}`);
  if (db.databaseName === "test") {
    console.log("WARNING: using the default `test` database — add /govinnovate to your connection string.");
  }

  let failures = 0;
  const check = (name: string, ok: boolean, detail = "") => {
    if (!ok) failures++;
    console.log(`${ok ? "MATCH " : "MISS  "} ${name}${detail ? ` (${detail})` : ""}`);
  };

  // ---- raw reads ----
  const [challenges, applications, pilots, templates] = await Promise.all([
    db.collection<Doc>("challenges").find({}).toArray(),
    db.collection<Doc>("applications").find({}).toArray(),
    db.collection<Doc>("pilots").find({}).toArray(),
    db.collection<Doc>("templates").find({}).toArray(),
  ]);
  const pilot = [...pilots].sort((a, b) => b._id - a._id)[0];
  const milestones = pilot
    ? await db.collection<Doc>("milestones").find({ pilot_id: pilot._id }).toArray()
    : [];
  const evals = pilot
    ? await db.collection<Doc>("evaluations").find({ application_id: pilot.application_id }).toArray()
    : [];
  const scaleDecision = pilot
    ? (await db.collection<Doc>("scale_up_decisions").find({ pilot_id: pilot._id }).sort({ _id: -1 }).limit(1).toArray())[0]
    : undefined;
  const sourceApp = pilot
    ? await db.collection<Doc>("applications").findOne({ _id: pilot.application_id })
    : undefined;

  // ---- expected display values ----
  const total = milestones.length;
  const paid = milestones.filter((m) => m.status === "paid");
  const cleared = milestones.filter((m) => m.status === "paid" || m.status === "verified");
  const paidTotal = paid.reduce((s, m) => s + Number(m.amount || 0), 0);
  const e = evals[0];
  const avg = e
    ? [e.innovation_score, e.feasibility_score, e.impact_score, e.scalability_score, e.viability_score].reduce(
        (a: number, b: number) => a + b,
        0
      ) / 5
    : null;

  // ---- rendered pages (normalized: React comment nodes + HTML entities) ----
  const normalize = (html: string) =>
    html
      .replace(/<!--.*?-->/gs, "")
      .replace(/&amp;/g, "&")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  const landing = normalize(await (await fetch(`${BASE_URL}/`)).text());
  const tpl = normalize(await (await fetch(`${BASE_URL}/templates`)).text());

  const pilotDept = pilot
    ? (challenges.find((c) => c._id === pilot.challenge_id)?.department ?? "")
    : "";
  if (pilotDept) check("dashboard department", landing.includes(pilotDept));
  if (pilot && total > 0) {
    check("kpi target tranches", landing.includes(`${total} tranches`));
    check("kpi paid tranches", landing.includes(`${paid.length} paid`));
    check("kpi budget target", landing.includes(inr(Number(pilot.budget || 0))));
    check("kpi budget actual", landing.includes(inr(paidTotal)));
    check("kpi cleared", landing.includes(`${cleared.length} cleared`));
    check("completion pct", landing.includes(`${Math.round((paid.length / total) * 100)}%`));
  }
  if (avg !== null) check("evaluation average", landing.includes(`${Math.round(avg * 10)} / 100`));
  if (sourceApp) {
    const label = ["shortlisted", "selected"].includes(sourceApp.status) ? "Verified" : "In review";
    check("eligibility label", landing.includes(label));
  }
  if (scaleDecision) check("scale decision label", landing.includes("In progress") || landing.includes(scaleDecision.decision));
  for (const label of ["Challenges", "Applications", "Eligible applications", "Pilots", "Validated", "Scaled"]) {
    check(`funnel stage: ${label}`, landing.includes(label));
  }
  check("templates count", tpl.includes(`${templates.length} of ${templates.length} templates`));
  for (const t of templates) {
    if (!tpl.includes(t.title)) {
      check(`template visible: ${t.title}`, false);
    }
  }
  check("all templates visible", templates.every((t) => tpl.includes(t.title)));

  // ---- integrity: counters keep pace with max ids ----
  const counters = await db.collection<{ _id: string; seq: number }>("counters").find({}).toArray();
  const cMap = new Map(counters.map((c) => [c._id, c.seq]));
  for (const name of ["users", "challenges", "applications", "pilots", "milestones", "templates"]) {
    const top = await db.collection<Doc>(name).find({}).sort({ _id: -1 }).limit(1).toArray();
    const maxId = top[0]?._id ?? 0;
    const seq = cMap.get(name) ?? -1;
    check(`counter ${name} >= max id (${seq} >= ${maxId})`, seq >= maxId);
  }
  const mig = await db.collection<Doc>("schema_migrations").find({}).sort({ version: -1 }).limit(1).toArray();
  check(`migrations applied (latest v${mig[0]?.version ?? "none"})`, (mig[0]?.version ?? 0) >= 2);

  await client.close();
  console.log(failures === 0 ? "ALL ACCURATE" : `${failures} MISMATCHES FOUND`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("Verification failed:", e?.message ?? e);
  process.exit(1);
});
