const autocannon = require("autocannon");

/**
 * Load smoke: hammers the database-backed routes of a RUNNING instance.
 * Usage: npm run start (in one terminal) then npm run load (in another).
 * Pass BASE_URL env to target elsewhere, e.g. staging.
 */
const BASE = process.env.LOAD_BASE_URL || "http://localhost:3000";

const scenarios = [
  { name: "landing (SSR + 8 queries)", url: `${BASE}/` },
  { name: "templates (DB list)", url: `${BASE}/templates` },
  { name: "health (DB ping)", url: `${BASE}/api/health` },
  { name: "login (static form)", url: `${BASE}/login` },
];

async function runOne({ name, url }) {
  const result = await autocannon({
    url,
    connections: 25,
    duration: 15,
    maxOverallRequests: 2000,
  });
  const p99 = result.latency.p99;
  const errors = result.errors + result.timeouts + result["4xx"] + result["5xx"];
  console.log(`\n### ${name}`);
  console.log(`    requests : ${result.requests.total} (${result.requests.average}/s)`);
  console.log(`    latency  : p50 ${result.latency.p50}ms / p99 ${p99}ms`);
  console.log(`    errors   : ${errors} (non-2xx ${result["4xx"] + result["5xx"]}, timeouts ${result.timeouts})`);
  return { name, errors, p99 };
}

(async () => {
  console.log(`Target: ${BASE}`);
  const results = [];
  for (const s of scenarios) results.push(await runOne(s));
  const failed = results.filter((r) => r.errors > 0 || r.p99 > 5000);
  console.log(failed.length === 0 ? "\nLOAD OK: no errors, p99 under 5s on all routes." : `\nLOAD ISSUES on: ${failed.map((f) => f.name).join(", ")}`);
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((e) => {
  console.error("Load run failed:", e?.message ?? e);
  process.exit(1);
});
